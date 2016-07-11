System.register(['@angular/core', './formulaire', '@angular/http', "@angular/common", "./radio_value_accessor", 'rxjs/Rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, formulaire_1, http_1, common_1, radio_value_accessor_1, Rx_1;
    var FormCondDistri;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (formulaire_1_1) {
                formulaire_1 = formulaire_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (radio_value_accessor_1_1) {
                radio_value_accessor_1 = radio_value_accessor_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            FormCondDistri = (function (_super) {
                __extends(FormCondDistri, _super);
                function FormCondDistri(http) {
                    _super.call(this, http);
                    this.idCal = "J";
                    this.v = {
                        "Q": "3",
                        "D": "1.2",
                        "J": "0.6",
                        "Lg": "100",
                        "nu": "1E-6",
                        "pr": "0.001"
                    };
                    this.glob = {
                        "Q": "fix",
                        "D": "fix",
                        "J": "cal",
                        "Lg": "fix",
                        "nu": "fix"
                    };
                    this.paramVar = {
                        "min": "",
                        "max": "",
                        "pas": ""
                    };
                    this.tabResults = {
                        "ids": [],
                        "noms": [],
                        "values": []
                    };
                }
                FormCondDistri.prototype.ngOnInit = function () {
                    this.getFieldsAndOptions();
                };
                FormCondDistri.prototype.getFieldsAndOptions = function () {
                    var _this = this;
                    Rx_1.Observable.forkJoin(this.http.get('/app/champs_cd.json').map(function (res) { return res.json().fields; }), this.http.get('/app/choix_var.json').map(function (res) { return res.json().options; })).subscribe(function (data) {
                        _this.fields = data[0];
                        _this.options = data[1];
                    }, function (err) { return console.error(err); });
                };
                /*initRadVarTable(){
            
                    for(var cle in this.v){
                        this.options[0].value=this.v[cle]/2;
                        this.options[1].value=this.v[cle]*2;
                        this.options[2].value=this.v[cle]/10;
                    }
                }*/
                FormCondDistri.prototype.calculer = function () {
                    _super.prototype.calculer.call(this);
                    var acalculer = this.v[this.idCal];
                    var q = this.v['Q'];
                    var d = this.v['D'];
                    var j = this.v['J'];
                    var lg = this.v['Lg'];
                    var nu = this.v['nu'];
                    //var p=numbers[5];*/
                    var K = 0.3164 * Math.pow(4, 1.75) / (5.5 * 9.81 * Math.pow(3.1415, 1.75)); // Constante de la formule
                    var result;
                    switch (acalculer) {
                        case j:
                            result = K * Math.pow(nu, 0.25) * Math.pow(q, 1.75) * lg / Math.pow(d, 4.75);
                            break;
                        case d:
                            result = Math.pow(j / (K * Math.pow(nu, 0.25) * Math.pow(q, 1.75) * lg), 1 / 4.75);
                            break;
                        case q:
                            result = Math.pow(j / (K * Math.pow(nu, 0.25) * lg / Math.pow(d, 4.75)), 1 / 1.75);
                            break;
                        case lg:
                            result = j / (K * Math.pow(nu, 0.25) * Math.pow(q, 1.75) / Math.pow(d, 4.75));
                            break;
                        case nu:
                            result = Math.pow(j / (K * Math.pow(q, 1.75) * lg / Math.pow(d, 4.75)), 1 / 0.25);
                            break;
                    }
                    this.result = result;
                };
                FormCondDistri = __decorate([
                    core_1.Component({
                        selector: 'form_cond',
                        templateUrl: 'app/form_cond_distri.html',
                        directives: [common_1.FORM_DIRECTIVES, radio_value_accessor_1.RadioControlValueAccessor]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], FormCondDistri);
                return FormCondDistri;
            }(formulaire_1.Formulaire));
            exports_1("FormCondDistri", FormCondDistri);
        }
    }
});
//# sourceMappingURL=form_cond_distri.js.map