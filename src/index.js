import $ from 'jquery';
import _ from 'underscore';
import helper from 'targetprocess-mashup-helper';

import storageApi from './storageApi';

require('./index.css');

let boardId;
let $el;

let savedSizes = {};

let $style;

let levelsByDepth = {};

const log = (...args) => {

    console.log.apply(console, args);

    return args.pop();

};

const getUnitId = ($cell) => ($cell.data('unit-id') || $cell.data('id')).replace('_sortable__', '__');

const getLevels = () => $el.find('.tau-list-level');

const getLevelId = ($level) => $level.attr('id');
const getLevelDepth = ($level) => $level.data('list-level');

const getHeaderCellsByLevel = ($level) => $level.children('.i-role-headerholder').find('.tau-elems-cell');

const getColCellsByLevelId = (id) => {

    // need only first real row
    const $row = $el.find(`#${id} > .i-role-cardsholder > :not(.tau-axis-card-no-value):first`);

    return $row.find('.tau-elems-table .tau-board-unit');

};

const saveSizes = (sizes) => {

    savedSizes = sizes;

    if (window.loggedUser.isAdministrator) {

        return storageApi.setPublic('ListColumnsResizer', boardId, {data: JSON.stringify(sizes)});

    } else {

        return storageApi.set('ListColumnsResizer', boardId, {data: JSON.stringify(sizes)});

    }

};

const loadSavedSizes = () => storageApi
    .get('ListColumnsResizer', boardId)
    .then(({data: res}) => {

        try {

            return JSON.parse(res);

        } catch (e) {

            return {};

        }

    });

const mergeSavedSizes = () => {

    levelsByDepth = savedSizes || {};

};

const setStyle = (text) => {

    $style.text(text);

};

const generateStyle = () => {

    return _.map(levelsByDepth, (level, depth) => {

        return _.map(level, (width, unitId) => {

            return [
                `.tau-list-level-${depth} .tau-list-caption .tau-list-${unitId}-cell {width: ${width}px !important; }`,
                `.tau-list-level-${depth} .tau-elems-table .tau-board-unit.tau-list-${unitId}-cell {width: ${width - 1}px !important; }`
            ].join('\n');

        }).join('\n\n');

    }).join('\n\n\n');

};

const setWidthByLevelDepthAndUnit = (depth, unitId, width) => {

    var level = levelsByDepth[depth];

    var columnWidth = level[unitId];

    if (columnWidth === width) {

        return;

    }

    level[unitId] = width;

    setStyle(generateStyle());

};

const collectAndSaveSizes = () => {

    const dataToSave = levelsByDepth;

    saveSizes(dataToSave);

};

const addLevelToStructure = ($level) => {

    const depth = getLevelDepth($level);

    const depthLevel = levelsByDepth[depth] || {};

    levelsByDepth[depth] = depthLevel;

    getColCellsByLevelId(getLevelId($level)).each((k, v) => {

        const $cell = $(v);
        const unitId = getUnitId($cell);

        depthLevel[unitId] = $cell.outerWidth() + 2;

    });

    levelsByDepth[depth] = depthLevel;

};

const collectStructure = ($levels) => {

    $levels.map((k, v) => {

        addLevelToStructure($(v));

    });

};

const addResizersToLevel = ($level) => {

    if ($level.data('ListColumnsResizer-added')) {

        return;

    }

    addLevelToStructure($level);

    $level.data('ListColumnsResizer-added', true);

    const $cells = getHeaderCellsByLevel($level);

    $cells.each((k, v) => $(v).append('<div class="ListColumnResizer-resizer"></div>'));

    $cells.each((k, v) => $(v).data('level-depth', getLevelDepth($level)).data('unit-id', getUnitId($(v))));

    const $resizers = $cells.find('.ListColumnResizer-resizer');

    $resizers.draggable({
        axis: 'x',
        containment: $cells.parent(),
        cursor: 'ew-resize',
        cursorAt: false,
        stop: () => {

            collectAndSaveSizes();
            $resizers.css({
                left: 'auto'
            });

        },

        drag: (e, {position, offset}) => {

            position.left = position.left - 1;

            const $currentCell = $(e.target).parent();
            const delta = offset.left - $currentCell.offset().left;

            const width = delta;

            if (width <= 17) {

                e.stopPropagation();
                return false;

            }

            const levelDepth = $currentCell.data('level-depth');
            const unitId = $currentCell.data('unit-id');

            setWidthByLevelDepthAndUnit(levelDepth, unitId, width);

        }

    });

};

const init = () => {

    const $levels = getLevels();

    mergeSavedSizes();

    $levels.each((k, v) => addResizersToLevel($(v)));

    setStyle(generateStyle());

    $el.on('click', '.tau-list-level', (e) => {

        addResizersToLevel($(e.currentTarget));

    });

};

helper.addBusListener('newlist', 'boardSettings.ready', (e, {boardSettings}) => {

    boardId = boardSettings.settings.id;

});

helper.addBusListener('newlist', 'overview.board.ready', (e, {element: $el_}) => {

    $el = $el_;

    $el.addClass('ListColumnResizer-added');

    loadSavedSizes().then((savedSizes_) => {

        savedSizes = savedSizes_;
        levelsByDepth = {};
        init();

    });

    $style = $('<style />').appendTo($el);

});
