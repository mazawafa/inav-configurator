'use strict';

import { GUI, TABS } from './../js/gui';
import Settings from './../js/settings';
import i18n from './../js/localization';

var tabs = (function () {
    let self = {},
        $container;

    function onHeaderClick(event) {
        let $cT = $(event.currentTarget),
            attrFor = $cT.attr("for");

        $container.find('.subtab__header_label').removeClass("subtab__header_label--current");
        $cT.addClass("subtab__header_label--current");
        $container.find(".subtab__content--current").removeClass("subtab__content--current");
        $container.find("#" + attrFor).addClass("subtab__content--current");

        var tab = attrFor.substring(7);

        /*
        swtich(tab) {
            case 'osd':
                import('./../tabs/osd').then(() => TABS.osd.initialize(content_ready));
                break;
            case 'sensors':
                import('./../tabs/sensors').then(() => TABS.sensors.initialize(content_ready));
                break;
            default:
                console.log('Tab not found:' + tab);
        }
        */
    };

    self.init = function ($dom) {
        $container = $dom;

        $container.find(".subtab__header_label").on('click', onHeaderClick);
    };

    return self;
})();

TABS.osd_and_sensors = {
    rateChartHeight: 117
};

TABS.osd_and_sensors.initialize = function (callback) {
    if (GUI.active_tab != 'osd_and_sensors') {
        GUI.active_tab = 'osd_and_sensors';
    }

    import('./osd_and_sensors.html?raw').then(({default: html}) => {
        GUI.load(html, Settings.processHtml(process_html))
    });

    function process_html() {
        // translate to user-selected language
        i18n.localize();

        tabs.init($('.tab-osd_and_sensors'));

        GUI.content_ready(callback);
    }
};

TABS.osd_and_sensors.cleanup = function (callback) {
    if (callback) {
        callback();
    }
};
