'use strict';

import { GUI, TABS } from './../js/gui';
import Settings from './../js/settings';
import i18n from './../js/localization';

var tabs = (function () {
    let self = {},
        $container;

    function onHeaderClick(event) {
        let $cT = $(event.currentTarget);
        let subtab = $cT.attr("for");
        let tab = subtab.substring(7);

        if ($cT.hasClass('subtab__header_label--current') || GUI.tab_switch_in_progress)
            return;

        if (GUI.connect_lock) { // tab switching disabled while operation is in progress
            GUI.log(i18n.getMessage('tabSwitchWaitForOperation'));
            return;
        }

        if (GUI.allowedTabs.indexOf(tab) < 0) {
            GUI.log(i18n.getMessage('tabSwitchUpgradeRequired', [tab]));
            return;
        }

        GUI.tab_switch_in_progress = true;

        GUI.tab_switch_cleanup(function () {

            $container.find('.subtab__header_label').removeClass("subtab__header_label--current");
            $cT.addClass("subtab__header_label--current");

            var oldContent = $container.find(".subtab__content--current");
            oldContent.data('empty', !!oldContent.is(':empty'));
            oldContent.removeClass("subtab__content--current");
            oldContent.empty();

            var newContent = $container.find("#" + subtab);
            newContent.addClass("subtab__content--current");

            // $('#cache .data-loading').clone().appendTo(newContent);
            
            switch (tab) {
                case 'osd':
                    import('./../tabs/osd')
                        .then(() => TABS.osd.initialize(content_ready, $('#' + subtab)));
                    break;

                case 'sensors':
                    import('./../tabs/sensors')
                        .then(() => TABS.sensors.initialize(content_ready, $('#' + subtab)));
                    break;

                default:
                    console.log('Tab not found:' + tab);
            }
        });
    };

    self.init = function ($dom) {
        $container = $dom;
        
        const first = $container.find(".subtab__header_label--current").attr("for");
        const mount = $container.find('#' + first);
        import('./../tabs/osd').then(() => TABS.osd.initialize(content_ready, mount));
        $container.find(".subtab__header_label").on('click', onHeaderClick);
    };

    return self;
})();

function content_ready() {
    GUI.tab_switch_in_progress = false;
}

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
