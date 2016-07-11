System.register(['@angular/core', '@angular/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var Formulaire;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            Formulaire = (function () {
                //public glob_before={}; //état des radios avant le binding
                function Formulaire(http) {
                    this.http = http;
                    this.options = new Object();
                    this.v = new Object();
                    this.showResult = false; //boolean pour afficher le tableau des resultats et le graphique
                }
                Formulaire.prototype.setNom = function (id) {
                    var nom = "";
                    var length = this.fields.length;
                    var index;
                    for (var i = 0; i < length; i++) {
                        if (this.fields[i].id == id) {
                            index = i;
                        }
                    }
                    return this.fields[index].name;
                };
                Formulaire.prototype.initRadVarTable = function (id) {
                    for (var cle in this.v) {
                        if (cle == id) {
                            this.options[0].value = this.v[cle] / 2;
                            this.options[1].value = this.v[cle] * 2;
                            this.options[2].value = this.v[cle] / 10;
                        }
                    }
                };
                Formulaire.prototype.RemplirTabResults = function () {
                    this.tabResults.ids.splice(0, this.tabResults.ids.length);
                    this.tabResults.noms.splice(0, this.tabResults.noms.length);
                    this.tabResults.values.splice(0, this.tabResults.values.length);
                    var length = this.fields.length;
                    for (var i = 0; i < length; i++) {
                        if (this.fields[i].id != this.idCal) {
                            this.tabResults.ids.push(this.fields[i].id);
                            this.tabResults.noms.push(this.fields[i].name);
                            this.tabResults.values.push(this.v[this.fields[i].id]);
                        }
                    }
                };
                Formulaire.prototype.afficherChamp = function (id, value) {
                    //gerer les champs à calculer 
                    if (value == 'fix') {
                        document.getElementById(id).disabled = false;
                    }
                    else {
                        document.getElementById(id).disabled = true;
                    }
                };
                Formulaire.prototype.gestionRadios = function (id, value) {
                    //recuper l'element à calculer
                    if (value == "cal") {
                        this.idCal = id;
                    }
                    //recuperer l'élement à varier
                    if (value == 'var') {
                        this.initRadVarTable(id);
                        this.varVar = id;
                        this.showVar = true;
                    }
                    else {
                        this.showVar = false;
                    }
                    console.log(this.varVar);
                    console.log(value + '_' + id);
                    console.log(this.glob);
                    //On gère l'affichage du champ sélectionné
                    this.afficherChamp(id, value);
                    //console.log(this.showVar);
                    // Pour var et cal, on bascule en fix l'ancien champ en var ou cal
                    if (value != 'fix') {
                        for (var cle in this.glob) {
                            if (this.glob[cle] == value && cle != id) {
                                document.getElementById('fix_' + cle).checked = true;
                                this.afficherChamp(cle, 'fix');
                                document.getElementById(value + '_' + cle).checked = false;
                            }
                            //pour garder le showVar actif quand on change le param à calculer
                            if (value == 'cal' && this.glob[cle] == 'var') {
                                this.showVar = true;
                            }
                        }
                    }
                    // Si l'action est sur un ancien cal, on bascule le champ cal par défaut
                    if (this.glob[id] == 'cal' && value != 'cal') {
                        document.getElementById('cal_J').checked = true;
                        this.afficherChamp('J', 'cal');
                    }
                };
                Formulaire.prototype.calculer = function () {
                    this.nomCal = this.setNom(this.idCal);
                    this.showResult = true;
                    this.RemplirTabResults();
                };
                Formulaire = __decorate([
                    core_1.Component({
                        selector: 'formu',
                    }), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], Formulaire);
                return Formulaire;
            }());
            exports_1("Formulaire", Formulaire);
        }
    }
});
//# sourceMappingURL=formulaire.js.map