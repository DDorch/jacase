System.register(['@angular/core', './formulaire', '@angular/http', 'rxjs/Rx'], function(exports_1, context_1) {
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
    var core_1, formulaire_1, http_1;
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
            function (_1) {}],
        execute: function() {
            FormCondDistri = (function (_super) {
                __extends(FormCondDistri, _super);
                function FormCondDistri(http) {
                    _super.call(this, http);
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
                }
                FormCondDistri.prototype.ngOnInit = function () {
                    this.getFields();
                };
                FormCondDistri.prototype.getFields = function () {
                    var _this = this;
                    this.http.get('/app/champs_cd.json')
                        .map(function (res) { return res.json().fields; })
                        .subscribe(function (data) { _this.fields = data; }, function (err) { return console.error(err); }, function () { return console.log('done'); });
                };
                FormCondDistri.prototype.getRadioValue = function (radioName) {
                    var radioElmt = document.getElementsByTagName(radioName);
                    var choix = "";
                    for (var i = 0; i < radioElmt.length; i++) {
                        if (radioElmt.checked) {
                            choix = radioElmt[i].value;
                        }
                    }
                    return choix;
                };
                FormCondDistri.prototype.setVarGlob = function () {
                    for (var i = 0; i < this.fields.length; i++) {
                        this.glob[this.fields[i].id] = this.getRadioValue("choix_champ_" + this.fields[i].id);
                    }
                };
                FormCondDistri.prototype.setVarGlobBefore = function () {
                    this.glob_before = this.glob;
                };
                FormCondDistri.prototype.afficherChamp = function (id, value) {
                    //gerer les champs à calculer 
                    if (value == 'fix') {
                        document.getElementById(id).disabled = false;
                    }
                    else {
                        document.getElementById(id).disabled = true;
                    }
                    // A compléter avec les champs à afficher si on choisi une 'var'
                };
                FormCondDistri.prototype.gestionRadios = function (id, value) {
                    console.log(this.glob);
                    // On gère l'affichage du champ sélectionné
                    /*this.afficherChamp(id,value);
                    // Pour var et cal, on bascule en fix l'ancien champ en var ou cal
                    if(value != 'fix') {
                        for (var cle in this.glob){
                            if(this.glob[cle]==value && cle != id) {
                                (<HTMLInputElement>document.getElementById('fix_'+cle)).checked=true;
                                this.afficherChamp(cle,'fix');
                             }
                        }
                     }
                     // Si l'action est sur un ancien cal, on bascule le champ cal par défaut
                     if(this.glob[id]=='cal' && value != 'cal') {
                         (<HTMLInputElement>document.getElementById('cal_J')).checked=true;
                         this.afficherChamp('J','cal');
                     }
                     this.setVarGlob();
                     */
                };
                FormCondDistri.prototype.calculer = function () {
                    //this.v.splice(0,this.v.length);
                    var length = this.fields.length;
                    console.log(this.v);
                    console.log(this.glob);
                    //Récupérer l'id l'élement selectionné à calculer
                    var id;
                    for (var i = 0; i < length; i++) {
                        var e = document.getElementById("cal_" + this.fields[i].id);
                        if (e.checked) {
                            id = this.fields[i].id;
                        }
                        else {
                            id = "J";
                        }
                    }
                    this.result = this.cond_distri(id);
                    console.log(this.result);
                };
                FormCondDistri.prototype.cond_distri = function (id) {
                    var acalculer = this.v[id];
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
                    return result;
                };
                FormCondDistri.prototype.afficherResultat = function () {
                    document.getElementById('result_table').style.display = "block";
                };
                FormCondDistri = __decorate([
                    core_1.Component({
                        selector: 'form_cond',
                        templateUrl: 'app/form_cond_distri.html'
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