System.register(['@angular/platform-browser-dynamic', './form_cond_distri', './formulaire', '@angular/http', '@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, form_cond_distri_1, formulaire_1, http_1, core_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (form_cond_distri_1_1) {
                form_cond_distri_1 = form_cond_distri_1_1;
            },
            function (formulaire_1_1) {
                formulaire_1 = formulaire_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            core_1.enableProdMode();
            platform_browser_dynamic_1.bootstrap(form_cond_distri_1.FormCondDistri, [formulaire_1.Formulaire, http_1.HTTP_PROVIDERS]);
        }
    }
});
//# sourceMappingURL=boot.js.map