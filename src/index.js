import $ from 'jquery';
import helper from 'targetprocess-mashup-helper';

import storageApi from './storageApi';

require('./index.css');

let boardId;
let $el;

const getUnitId = ($cell) => {

    return $cell.data('unitId') || $cell.data('id');

};

const getLevels = () => {

    return $el.find('.tau-list-level');

};

const getLevelId = ($level) => {

    return $level.data('list-level');

};

const getLevelsById = (id) => {

    return getLevels().filter((k, v) => getLevelId($(v)) == id);

};

const getSameLevels = ($level) => getLevelsById(getLevelId($level));

const setColCellsWidth = ($cells, width) => {

    $cells.innerWidth(width);

};

const setHeaderCellWidth = ($cell, width) => {

    $cell.innerWidth(width);

};

const getHeaderCellsByLevel = ($level) => {

    return $level.children('.i-role-headerholder').find('.tau-elems-cell');

};

const getAllHeaderCellsByLevel = ($level) => {

    return getSameLevels($level).children('.i-role-headerholder').find('.tau-elems-cell');

};

const getAllColCellsByLevel = ($level) => {

    return getSameLevels($level).children('.i-role-cardsholder').children('.i-role-card')
        .children('.tau-list-line').children('.tau-elems-table').find('.tau-board-unit');

};

const getAllHeaderCellsByLevelAndUnitId = ($level, unitId) => {

    return getAllHeaderCellsByLevel($level).filter((k, v) => getUnitId($(v)) === unitId);

};

const getAllColCellsByLevelAndUnitId = ($level, unitId) => {

    return getAllColCellsByLevel($level).filter((k, v) => getUnitId($(v)) === unitId);

};

const collectSizesFromCells = ($cells, levelId) => {

    const sizes = {
        [levelId]: $cells.toArray().reduce((res, v) => {

            return {...res, [v.getAttribute('data-unit-id')]: $(v).outerWidth()};

        }, {})
    };

    return sizes;

};

const setSizesToCells = (sizes) => {

    Object.keys(sizes).forEach((level) => {

        const levelSizes = sizes[level];

        const $level = getLevelsById(level);

        Object.keys(levelSizes).forEach((unitId) => {

            const width = levelSizes[unitId];

            const $headerCell = getAllHeaderCellsByLevelAndUnitId($level, unitId);

            setHeaderCellWidth($headerCell, width);

            const $colCells = getAllColCellsByLevelAndUnitId($level, unitId);

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

const collectAndSaveSizes = () => {

    const sizes = getLevels().toArray().reduce((res, v) => {

        const $level = $(v);
        const $headerCells = getHeaderCellsByLevel($level);

        return {...res, ...collectSizesFromCells($headerCells, getLevelId($level))};

    }, {});

    console.log('RES', sizes);

    return saveSizes(sizes);

};

const restoreSizes = () => {

    return storageApi.get('ListColumnsResizer', boardId)
        .then(({data: res}) => {

            try {

                return JSON.parse(res);

            } catch (e) {

                return {};

            }

        })
        .then(setSizesToCells);

};

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

            if (width <= 10) {

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

    restoreSizes();

    const $levels = getLevels().filter((k, v) => !$(v).data('isResizerAdded'));
    console.log($levels);
    $levels.each((k, v) => {

        const $level = $(v);

        $level.data('isResizerAdded', true);

        addResizersToLevel($level);

    });

};

helper.addBusListener('newlist', 'overview.board.ready', (e, {element: $el_}) => {

    $el = $el_;

    init();

    $el.on('mouseenter', '.i-role-list-root-container', () => init());

});
