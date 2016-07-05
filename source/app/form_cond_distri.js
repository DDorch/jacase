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
                FormCondDistri.prototype.activeDesactive = function (id) {
                    console.log(id);
                    var v1 = document.getElementById("fix_" + id);
                    var v2 = document.getElementById("var_" + id);
                    var v3 = document.getElementById("cal_" + id);
                    var ids = ['Q', 'D', 'J', 'Lg', 'nu'];
                    var n = ids.length;
                    var e1 = new Array();
                    var e2 = new Array();
                    var e3 = new Array();
                    for (var i = 0; i < n; i++) {
                        var v = document.getElementById("fix_" + ids[i]);
                        e1.push(v);
                    }
                    for (var i = 0; i < n; i++) {
                        var v = document.getElementById("var_" + ids[i]);
                        e2.push(v);
                    }
                    for (var i = 0; i < n; i++) {
                        var v = document.getElementById("cal_" + ids[i]);
                        e3.push(v);
                    }
                    if (v2.checked) {
                        for (var i = 0; i < n; i++) {
                            for (var j = 0; j < n; j++) {
                                if (e2[i] == v2 && j != i) {
                                    e2[j].checked = false;
                                    for (var k = 0; k < n; k++) {
                                        if (e3[k].checked && k != j) {
                                            e1[j].checked = true;
                                            e1[k].checked = false;
                                        }
                                        else if (e2[k].checked && k != i) {
                                            e1[k].checked = true;
                                            e1[j].checked = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (v3.checked) {
                        for (var i = 0; i < n; i++) {
                            for (var j = 0; j < n; j++) {
                                if (e3[i] == v3 && j != i) {
                                    e3[j].checked = false;
                                    for (var k = 0; k < n; k++) {
                                        if (e2[k].checked && k != j) {
                                            e1[j].checked = true;
                                            e1[k].checked = false;
                                        }
                                        else if (e3[k].checked && k != i) {
                                            e1[k].checked = true;
                                            e1[j].checked = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                FormCondDistri.prototype.calculer = function () {
                    //this.v.splice(0,this.v.length);
                    var length = this.fields.length;
                    for (var i = 0; i < length; i++) {
                        this.v[this.fields[i].id] = document.getElementById(this.fields[i].id).value;
                        this.v[this.fields[i].id] = Number(this.v[this.fields[i].id]);
                    }
                    console.log(this.v);
                    //Récupérer l'id l'élement selectionné à calculer
                    var id;
                    for (var i = 0; i < length; i++) {
                        var e = document.getElementById("cal_" + this.fields[i].id);
                        if (e.checked) {
                            id = this.fields[i].id;
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