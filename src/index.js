import $ from 'jquery';
import _ from 'underscore';
import helper from 'targetprocess-mashup-helper';

import storageApi from './storageApi';

require('./index.css');

let boardId;
let $el;
let observer;

const log = (...args) => {

    console.log.apply(console, args);

    return args.pop();

};

const getUnitId = ($cell) => $cell.data('unitId') || $cell.data('id');

const getLevels = () => $el.find('.tau-list-level');

const getLevelId = ($level) => $level.data('list-level');

const getLevelsById = (id) => getLevels().filter((k, v) => Number(getLevelId($(v))) === Number(id));

const getSameLevels = ($level) => getLevelsById(getLevelId($level));

const setColCellsWidth = ($cells, width) => {

    $cells.parent().width(width);
    $cells.css('width', '100%');

};

const setHeaderCellWidth = ($cell, width) => $cell.innerWidth(width);

const getHeaderCellsByLevel = ($level) => $level.children('.i-role-headerholder').find('.tau-elems-cell');

const getAllHeaderCellsByLevel = ($level) => getSameLevels($level)
    .children('.i-role-headerholder').find('.tau-elems-cell');

const getAllColCellsByLevel = ($level) => getSameLevels($level)
    .children('.i-role-cardsholder').children('.i-role-card')
    .children('.tau-list-line').children('.tau-elems-table').find('.tau-board-unit');

const getAllHeaderCellsByLevelAndUnitId = ($level, unitId) => getAllHeaderCellsByLevel($level)
    .filter((k, v) => getUnitId($(v)) === unitId);

const getAllColCellsByLevelAndUnitId = ($level, unitId) => getAllColCellsByLevel($level)
    .filter((k, v) => getUnitId($(v)) === unitId);

const collectSizesFromCells = ($cells, levelId) => ({
        [levelId]: $cells.toArray().reduce((res, v) => ({
            ...res,
            [v.getAttribute('data-unit-id')]: $(v).data('isInitedByResizer') ? $(v).parent().width() : $(v).outerWidth()
        }), {})
    });

const setSizesToCells = (sizes) => {

    Object.keys(sizes).forEach((level) => {

        const levelSizes = sizes[level];

        const $level = getLevelsById(level);

        Object.keys(levelSizes).forEach((unitId) => {

            const width = levelSizes[unitId];

            const $headerCell = getAllHeaderCellsByLevelAndUnitId($level, unitId);

            setHeaderCellWidth($headerCell, width);

            const $colCells = getAllColCellsByLevelAndUnitId($level, unitId);

            $colCells.data('isInitedByResizer', true);
            setColCellsWidth($colCells, width);

        });

    });

};

const saveSizes = (sizes) => {

    if (window.loggedUser.isAdministrator) {

        return storageApi.setPublic('ListColumnsResizer', boardId, {data: JSON.stringify(sizes)});

    } else {

        return storageApi.set('ListColumnsResizer', boardId, {data: JSON.stringify(sizes)});

    }

};

const collectSizes = () => getLevels().toArray().reduce((res, v) => {

        const $level = $(v);
        const $headerCells = getHeaderCellsByLevel($level);

        return {...res, ...collectSizesFromCells($headerCells, getLevelId($level))};

    }, {});

const collectAndSaveSizes = () => saveSizes(collectSizes());

const loadSavedSizes = () => storageApi
    .get('ListColumnsResizer', boardId)
    .then(({data: res}) => {

        try {

            return JSON.parse(res);

        } catch (e) {

            return {};

        }

    });

const restoreSizes = () => $.when(loadSavedSizes(), collectSizes())
    .then((savedSizes, collectedSizes) => ({
        ...collectedSizes,
        ...savedSizes
    }))
    .then(setSizesToCells);

const addResizersToLevel = ($level) => {

    const $cells = getHeaderCellsByLevel($level);

    $cells.each((k, v) => $(v).append('<div class="ListColumnResizer-resizer"></div>'));

    const $resizers = $cells.find('.ListColumnResizer-resizer');

    $resizers.draggable({
        axis: 'x',
        containment: $cells.parent(),
        cursor: 'ew-resize',
        cursorAt: false,
        stop: () => {

            collectAndSaveSizes($el);
            $resizers.css({
                left: 'auto'
            });

        },

        drag: (e, {position, offset}) => {

            position.left = position.left - 1;

            const $currentCell = $(e.target).parent();
            const delta = offset.left - $currentCell.offset().left;

            const width = delta;

            // padding of header cells :(
            if (width <= 17) {

                e.stopPropagation();
                return false;

            }

            const unitId = getUnitId($currentCell);

            const $headerCells = getAllHeaderCellsByLevelAndUnitId($level, unitId);
            const $colCells = getAllColCellsByLevelAndUnitId($level, unitId);

            setHeaderCellWidth($headerCells, width);
            setColCellsWidth($colCells, width);

        }

    });

};

helper.addBusListener('newlist', 'boardSettings.ready', (e, {boardSettings}) => {

    boardId = boardSettings.settings.id;

});

const init = () => {

    const $levels = getLevels().not((k, v) => $(v).data('isResizerAdded'));
    const $cells = $el.find('.tau-board-unit').not((k, v) => $(v).data('isInitedByResizer'));

    if ($levels.length || $cells.length) {

        $el.find('.tau-elems-cell').addClass('ListColumnResizer-cell');

        $el.find('.tau-name-cell, .tau-elems-cell').removeClass('ui-resizable');
        $el.find('.tau-board-list-view-resizer').remove();

        const $caption = $el.find('.tau-list-caption');

        // to prevent text overlap
        $caption.find('.tau-elems-cell').css('background-color', $caption.css('background-color'));

        restoreSizes();

    }

    $levels.each((k, v) => {

        const $level = $(v);

        $level.data('isResizerAdded', true);

        addResizersToLevel($level);

    });

};

helper.addBusListener('newlist', 'overview.board.ready', (e, {element: $el_}) => {

    $el = $el_;

    init();

    const throttleInit = _.throttle(init, 500, {
        trailing: false
    });

    observer = new MutationObserver((mutations) => mutations.forEach(() => throttleInit()));

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe($el[0], config);

});

helper.addBusListener('newlist', 'destroy', () => {

    if ($el[0] && observer) {

        observer.disconnect($el[0]);

    }

});

