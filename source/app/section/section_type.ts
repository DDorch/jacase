import {acNewton} from "./newton";
import {cLog} from "./log"
/**
 * Calcul de la hauteur critique
 */
class cHautCritique extends acNewton {
        private Sn;
        private oP;
        /**
         * Constructeur de la classe
         * @param $oSn Section sur laquelle on fait le calcul
         * @param $oP Paramètres supplémentaires (Débit, précision...)
         */
        constructor(Sn: acSection,oP: cParam) {
                super(oP);
                this.Sn = Sn;
                this.oP = oP;
                
        }
        /**
         * Calcul de la fonction dont on cherche le zéro
         * @param $rX Variable dont dépend la fonction
         */
        CalcFn($rX) {
                // Calcul de la fonction
                if(this.Sn.Calc('S',$rX)!=0) {
                        var Fn = (Math.pow(this.oP.Q,2)*this.Sn.Calc('B',$rX)/Math.pow(this.Sn.Calc('S',$rX),3)/this.oP.G-1);
                }
                else {
                        Fn = Infinity;
                }
                return Fn;
        }
        /**
         * Calcul analytique de la dérivée de la fonction dont on cherche le zéro
         * @param $rX Variable dont dépend la fonction
         */
        CalcDer($rX) {
                if(this.Sn.Calc('S')!=0) {
                        // L'initialisation à partir de $rX a été faite lors de l'appel à CalcFn
                        var Der = (this.Sn.Calc('dB')*this.Sn.Calc('S')-3*this.Sn.Calc('B')*this.Sn.Calc('B'));
                        Der = Math.pow(this.oP.Q,2)/this.oP.G * Der / Math.pow(this.Sn.Calc('S'),4);
                }
                else {
                        Der = Infinity;
                }
                //spip_log('cHautCritique:CalcDer('.$rX.')='.$rDer,'hydraulic.'._LOG_DEBUG);
                return Der;
        }
}
/**
 * Calcul de la hauteur normale
 */
class cHautNormale extends acNewton {
        private Sn;
        private Q;
        private Ks;
        private If;
        private G;
        /**
         * Constructeur de la classe
         * @param $oSn Section sur laquelle on fait le calcul
         * @param $oP Paramètres supplémentaires (Débit, précision...)
         */
        constructor(Sn: acSection,oP: cParam) {
                super(oP);
                this.Sn= Sn;
                this.Q=oP.Q;
                this.Ks=oP.Ks;
                this.If=oP.If;
                this.G=oP.G;
        }
        /**
         * Calcul de la fonction dont on cherche le zéro
         * @param $rX Variable dont dépend la fonction
         */
        CalcFn($rX) {
                // Calcul de la fonction
                var Fn = (this.Q-this.Ks*Math.pow(this.Sn.Calc('R',$rX),2/3)*this.Sn.Calc('S',$rX)*Math.sqrt(this.If));
                return Fn;
        }
        /**
         * Calcul analytique de la dérivée de la fonction dont on cherche le zéro
         * @param $rX Variable dont dépend la fonction
         */
        CalcDer($rX) {
                // L'initialisation a été faite lors de l'appel à CalcFn
                var Der = 2/3*this.Sn.Calc('dR')*Math.pow(this.Sn.Calc('R'),-1/3)*this.Sn.Calc('S');
                Der = Der + Math.pow(this.Sn.Calc('R'),2/3)*this.Sn.Calc('B');
                Der = Der * -this.Ks * Math.sqrt(this.If);
                //spip_log('cHautNormale:CalcDer('.$rX.')='.$rDer,'hydraulic.'._LOG_DEBUG);
                return Der;
        }
}
/**
 * Calcul de la hauteur correspondante (charge égale)
 */
class cHautCorrespondante extends acNewton {
        private Y; // Tirant d'eau connu
        private rS2; // 1/S^2 associé au tirant d'eau connu
        private Sn; // Section contenant les données de la section avec la hauteur à calculer
        private rQ2G; // Constante de gravité
        /**
         * Constructeur de la classe
         * @param $oSn Section sur laquelle on fait le calcul
         * @param $oP Paramètres supplémentaires (Débit, précision...)
         */
        constructor(Sn: acSection,oP: cParam) {
                super(oP);
                this.Y = Sn.Y;
                this.rS2 = Math.pow(Sn.Calc('S'),-2);
                this.Sn = Sn;
                this.rQ2G = Math.pow(oP.Q,2)/(2*oP.G);
        }
        /**
         * Calcul de la fonction dont on cherche le zéro
         * @param $rX Variable dont dépend la fonction
         */
        CalcFn($rX) {
                // Calcul de la fonction
                var Fn = this.Y - $rX + (this.rS2-Math.pow(this.Sn.Calc('S',$rX),-2))*this.rQ2G;
                //~ spip_log('cHautCorrespondante:CalcFn('.$rX.')='.$rFn,'hydraulic.'._LOG_DEBUG);
                return Fn;
        }
        /**
         * Calcul analytique de la dérivée de la fonction dont on protected function cherche le zéro
         * @param $rX Variable dont dépend la fonction
         */
        CalcDer($rX) {
                // L'initialisation a été faite lors de l'appel à CalcFn
                if(this.Sn.Calc('S')!=0) {
                        var Der = -1 + 2 * this.rQ2G * this.Sn.Calc('B') / Math.pow(this.Sn.Calc('S'),3);
                }
                else {
                        Der = Infinity;
                }
                //~ spip_log('cHautCorrespondante:CalcDer('.$rX.')='.$rDer,'hydraulic.'._LOG_DEBUG);
                return Der;
        }
}
/**
 * Calcul de la hauteur conjuguée (Impulsion égale)
 */
class cHautConjuguee extends acNewton {
        /** Tirant d'eau connu */
        private Y;
        /** 1/S^2 associé au tirant d'eau connu */
        private rS2;
        /** Section contenant les données de la section avec la hauteur à calculer */
        private Sn;
        /** Constante de gravité */
        private G;
        /** Carré du débit */
        private rQ2;
        /** Surface hydraulique associée au tirant d'eau connu */
        private rS;
        /** SYg associée au tirant d'eau connu */
        private rSYg;
        /**
         * Constructeur de la classe
         * @param $oSn Section sur laquelle on fait le calcul
         * @param $oP Paramètres supplémentaires (Débit, précision...)
         */
        constructor( $oSn: acSection, $oP: cParam) {
                super($oP);
                this.Y = $oSn.Y;
                this.rQ2 = Math.pow($oP.Q,2);
                this.Sn = $oSn;
                this.G = $oP.G;
                this.rS = $oSn.Calc('S');
                this.rSYg = $oSn.Calc('SYg');
        }
        /**
         * Calcul de la fonction dont on cherche le zéro
         * @param $rX Variable dont dépend la fonction
         */
        CalcFn($rX) {
                // Réinitialisation des paramètres hydrauliques de oSn avec l'appel $this->oSn->Calc('S',$rX)
                if(this.rS > 0 && this.Sn.Calc('S',$rX) > 0) {
                        var Fn = this.rQ2 * (1 / this.rS - 1 / this.Sn.Calc('S'));
                        Fn = Fn + this.G * (this.rSYg - this.Sn.Calc('SYg'));
                }
                else {
                        Fn = -Infinity;
                }
                //~ spip_log('cHautConjuguee:CalcFn('.$rX.')='.$rFn,'hydraulic.'._LOG_DEBUG);
                return Fn;
        }
        /**
         * Calcul analytique de la dérivée de la fonction dont on cherche le zéro
         * @param $rX Variable dont dépend la fonction
         */
        CalcDer($rX) {
                // L'initialisation a été faite lors de l'appel à CalcFn
                if(this.rS > 0 && this.Sn.Calc('S') > 0) {
                        var Der = this.rQ2 * this.Sn.Calc('dS') * Math.pow(this.Sn.Calc('S'),-2);
                        Der = Der - this.G * this.Sn.Calc('dSYg',$rX);
                }
                else {
                        Der = -Infinity;
                }
                //~ spip_log('cHautConjuguee:CalcDer('.$rX.')='.$rDer,'hydraulic.'._LOG_DEBUG);
                return Der;
        }
}

/**
 * Gestion des Paramètres du canal (hors section)
 */
export class cParam {
        public YCL;   /// Condition limite en cote à l'amont ou à l'aval
        public Ks;    /// Strickler
        public Q;     /// Débit
        public Long;  /// Longueur du bief
        public If;    /// Pente du fond
        public Dx;    /// Pas d'espace (positif en partant de l'aval, négatif en partant de l'amont)
        public Prec;  /// Précision de calcul et d'affichage
        public G=9.81;/// Constante de gravité
        public iPrec;  /// Précision en nombre de décimales
        public YB;    /// Hauteur de berge
        public Resolution; /// Méthode de résolution "Euler" ou "RK4"
        constructor($rKs, $rQ, $rIf, $rPrec, $rYB, $rYCL = 0, $rDx = 0, $rLong = 0, $sResolution = '') {
                this.Resolution = $sResolution;
                this.YCL= $rYCL;
                this.Ks= $rKs;
                this.Q= $rQ;
                this.Long= $rLong;
                this.If= $rIf;
                this.Dx= $rDx;
                this.Prec= $rPrec;
                this.YB= $rYB;
                this.iPrec=-Math.log10($rPrec);
        }
}

/**
 * Gestion commune pour les différents types de section.
 * Comprend les formules pour la section rectangulaire pour gérer les débordements
 */
export abstract class acSection {

        public Y;          /// Tirant d'eau
        public HautCritique;  /// Tirant d'eau critique
        public HautNormale;   /// Tirant d'eau normal
        public oP: cParam;   /// Paramètres du système canal (classe oParam)
        protected oLog : cLog; /// Pour l'affichage du journal de calcul
        public LargeurBerge; /// largeur au débordement
        protected bSnFermee = false; /// true si la section est fermée (fente de Preissmann)
        /**
         * Tableau contenant les données dépendantes du tirant d'eau $this->rY.
         *
         * Les clés du tableau peuvent être :
         * - S : la surface hydraulique
         * - P : le périmètre hydraulique
         * - R : le rayon hydraulique
         * - B : la largeur au miroir
         * - J : la perte de charge
         * - Fr : le nombre de Froude
         * - dP : la dérivée de P par rapport Y
         * - dR : la dérivée de R par rapport Y
         * - dB : la dérivée de B par rapport Y
         */
        private arCalc = new Array();
        protected calcGeo = new Array(); /// Données ne dépendant pas de la cote de l'eau
        private Y_old ; /// Mémorisation du tirant d'eau pour calcul intermédiaire
        private Calc_old = new Array(); /// Mémorisation des données hydrauliques pour calcul intermédiaire
        /**
         * Nombre de points nécessaires pour le dessin de la section (hors point de berge)
         * Valeur de 1 par défaut pour les sections rectangulaires et trapézoïdales
         */
        protected nbDessinPoints=1;
        /**
         * Construction de la classe.
         * Calcul des hauteurs normale et critique
         */
        constructor(oLog,oP) {
                this.oP = oP;
                this.oLog = oLog;
                this.CalcGeo['B'];
        }
        /**
         * Efface toutes les données calculées pour forcer le recalcul
         * @param $bGeo Réinitialise les données de géométrie aussi
         */
        Reset(bGeo=true) {
                this.arCalc = new Array();
                if(bGeo) {
                        this.calcGeo = new Array();
                }
        }
        /**
         * Mémorise les données hydraulique en cours ou les restitue
         * @param bMem true pour mémorisation, false pour restitution
         */
        Swap(bMem) {
                if(bMem) {
                        this.Y_old = this.Y;
                        this.Calc_old = this.arCalc;
                }
                else {
                        this.Y = this.Y_old;
                        this.arCalc = this.Calc_old;
                        this.Calc_old = new Array();
                }
        }
        
        /**
         * Calcul des données à la section
         * @param $sDonnee Clé de la donnée à calculer (voir $this->$arCalc)
         * @param $bRecalc Pour forcer le recalcul de la donnée
         * @return la donnée calculée
         */
        Calc(sDonnee, rY = false) {
                if(rY!==false && rY!=this.Y) {
                        this.Y = rY;
                        // On efface toutes les données dépendantes de Y pour forcer le calcul
                        this.Reset(false);
                }
                // | or || ???
                if(!this.arCalc[sDonnee] || (this.arCalc[sDonnee] && !this.arCalc[sDonnee])) {
                        // La donnée a besoin d'être calculée
                        switch(sDonnee) {
                                case 'I-J' : // Variation linéaire de l'énergie spécifique (I-J) en m/m
                                this.arCalc[sDonnee] = this.oP.If-this.Calc('J');
                                break;
                                default :
                                var methode = 'Calc_'+ sDonnee ;
                                this.arCalc[sDonnee] = window[methode]();
                        }
                }
                //~ spip_log('Calc('.$sDonnee.')='.$this->arCalc[$sDonnee],'hydraulic.'._LOG_DEBUG);
                return this.arCalc[sDonnee];
        }
        
        /**
         * Calcul des données uniquement dépendantes de la géométrie de la section
         * @param $sDonnee Clé de la donnée à calculer (voir $this->$arCalcGeo)
         * @param $rY Hauteur d'eau
         * @return la donnée calculée
         */
        CalcGeo(sDonnee) {
                if(sDonnee != 'B' && !this.CalcGeo['B']) {
                        // Si la largeur aux berges n'a pas encore été calculée, on commence par ça
                        this.CalcGeo('B');
                }
                if(!this.CalcGeo[sDonnee]) {
                        // La donnée a besoin d'être calculée
                        this.Swap(true); // On mémorise les données hydrauliques en cours
                        this.Reset(false);
                        this.Y = this.oP.YB;
                        switch(sDonnee) {
                                case 'B' : // Largeur aux berges
                                this.CalcGeo[sDonnee] = this.Calc_B();
                                if(this.calcGeo[sDonnee] < this.oP.YB / 100) {
                                        // Section fermée
                                        this.bSnFermee = true;
                                        // On propose une fente de Preissmann égale à 1/100 de la hauteur des berges
                                        this.CalcGeo[sDonnee] = this.oP.YB / 100;
                                }
                                this.LargeurBerge = this.CalcGeo[sDonnee];
                                break;
                                default :
                                /*var methode = 'Calc_'+sDonnee + '()';
                                this.CalcGeo[sDonnee] = eval(methode);*/
                                var methode = 'Calc_'+sDonnee;
                                this.CalcGeo[sDonnee] = window[methode]();
                        }
                        //~ spip_log('CalcGeo('.$sDonnee.',rY='.$this->oP->rYB.')='.$this->arCalcGeo[$sDonnee],'hydraulic.'._LOG_DEBUG);
                        this.Swap(false); // On restitue les données hydrauliques en cours
                }
                return this.CalcGeo[sDonnee];
        }
        /**
         * Calcul de la surface hydraulique.
         * @return La surface hydraulique
         */
        Calc_S(rY) {
                //~ spip_log('section->CalcS(rY='.$rY.')='.($rY*$this->rLargeurBerge),'hydraulic.'._LOG_DEBUG);
                return rY*this.LargeurBerge;
        }
        /**
         * Calcul de la dérivée surface hydraulique.
         * @return La surface hydraulique
         */
        Calc_dS() {
                return this.LargeurBerge;
        }
        /**
         * Calcul du périmètre hydraulique.
         * @return Le périmètre hydraulique
         */
        Calc_P($rY=0) {
                //~ spip_log('section->CalcP(rY='.$rY.')='.(2*$rY),'hydraulic.'._LOG_DEBUG);
                return 2*$rY;
        }
        /**
         * Calcul de dérivée du périmètre hydraulique par rapport au tirant d'eau.
         * @return dP
         */
        Calc_dP() {
                return 2;
        }
        /**
         * Calcul du rayon hydraulique.
         * @return Le rayon hydraulique
         */
        Calc_R() {
                if(this.Calc('P')!=0) {
                        return this.Calc('S')/this.Calc('P');
                }
                else {
                        return Infinity;
                }
        }
        /**
         * Calcul de dérivée du rayon hydraulique par rapport au tirant d'eau.
         * @return dR
         */
        Calc_dR() {
                if(this.Calc('P')!=0) {
                        return (this.Calc('B')*this.Calc('P')-this.Calc('S')*this.Calc('dP')/Math.pow(this.Calc('P'),2));
                }
                else {
                        return 0;
                }
        }
        /**
         * Calcul de la largeur au miroir.
         * @return La largeur au miroir
         */
        Calc_B() {
                return this.LargeurBerge;
        }
        /**
         * Calcul de dérivée de la largeur au miroir par rapport au tirant d'eau.
         * @return dB
         */
        Calc_dB() {
                return 0;
        }
        /**
         * Calcul de la perte de charge par la formule de Manning-Strickler.
         * @return La perte de charge
         */
        Calc_J() {
                if(this.Calc('R')!=0) {
                        return Math.pow(this.Calc('V')/this.oP.Ks,2)/Math.pow(this.Calc('R'),4/3);
                }
                else {
                        return Infinity;
                }
        }
        /**
         * Calcul du nombre de Froude.
         * @return Le nombre de Froude
         */
        Calc_Fr() {
                if(this.Calc('S')!=0) {
                        return this.oP.Q/this.Calc('S')*Math.sqrt(this.Calc('B')/this.Calc('S')/this.oP.G);
                }
                else {
                        return Infinity;
                }
        }
        /**
         * Calcul de dy/dx
         */
        Calc_dYdX(Y) {
                // L'appel à Calc('J') avec Y en paramètre réinitialise toutes les données dépendantes de la ligne d'eau
                return - (this.oP.If - this.Calc('J',Y) / (1 - Math.pow(this.Calc('Fr',Y),2)));
        }

        XOR(a,b) {
             return ( a || b ) && !( a && b );
        }
        /**
         * Calcul du point suivant de la courbe de remous par la méthode Euler explicite.
         * @return Tirant d'eau
         */
        Calc_Y_Euler(Y) {
                // L'appel à Calc('J') avec Y en paramètre réinitialise toutes les données dépendantes de la ligne d'eau
                var Y2 = Y+ this.oP.Dx * this.Calc_dYdX(Y);
                if( this.XOR(this.oP.Dx > 0,!(Y2 < this.HautCritique)) ) {
                        return false;
                } else {
                        return Y2;
                }
        }
        /**
         * Calcul du point suivant de la courbe de remous par la méthode RK4.
         * @return Tirant d'eau
         */
        Calc_Y_RK4(Y) {
                // L'appel à Calc('J') avec Y en paramètre réinitialise toutes les données dépendantes de la ligne d'eau
                var Dx = this.oP.Dx;
                var k1 = this.Calc_dYdX(Y);
                if(this.XOR(Dx > 0,!(Y + Dx / 2 * k1 < this.HautCritique))) {return false;}
                var k2 = this.Calc_dYdX(Y + Dx / 2 * k1);
                if(this.XOR(Dx > 0 , !(Y + Dx / 2 * k2 < this.HautCritique))) {return false;}
                var k3 = this.Calc_dYdX(Y + Dx / 2 * k2);
                if(this.XOR(Dx > 0 , !(Y + Dx / 2 * k3 < this.HautCritique))) {return false;}
                var k4 = this.Calc_dYdX(Y + Dx * k3);
                if(this.XOR(Dx > 0 , !(Y + Dx / 6 * (k1 + 2 * (k2 + k3) + k4) < this.HautCritique))) {return false;}
                return Y + Dx / 6 * (k1 + 2 * (k2 + k3) + k4);
        }
        /**
         * Calcul du point suivant d'une courbe de remous
         * @return Tirant d'eau
         */
        Calc_Y($rY) {
                var funcCalcY = 'Calc_Y_'+this.oP.Resolution;
                var methods = Object.getOwnPropertyNames(this).filter(function (p) {
                        return typeof this[p] === 'function';
                });
                for(var m of methods){
                        if(funcCalcY==m){
                                return window[funcCalcY]($rY);
                        }
                        else{
                                return false;
                        }
                }
        }

        /**
         * Calcul de la vitesse moyenne.
         * @return Vitesse moyenne
         */
        Calc_V() {
                if(this.Calc('S')!=0) {
                        return this.oP.Q/this.Calc('S');
                }
                else {
                        return Infinity;
                }
        }
        /**
         * Calcul de la charge spécifique.
         * @return Charge spécifique
         */
        Calc_Hs() {
                return this.Y+Math.pow(this.Calc('V'),2)/(2*this.oP.G);
        }
        /**
         * Calcul de la charge spécifique critique.
         * @return Charge spécifique critique
         */
        Calc_Hsc() {
                this.Swap(true); // On mémorise les données hydrauliques en cours
                // On calcule la charge avec la hauteur critique
                var Hsc = this.Calc('Hs',this.CalcGeo('Yc'));
                // On restitue les données initiales
                this.Swap(false);
                return Hsc;
        }
        /**
         * Calcul du tirant d'eau critique.
         * @return tirant d'eau critique
         */
        Calc_Yc() {
                var hautCritique = new cHautCritique(this, this.oP);
                if(!this.HautCritique == hautCritique.Newton(this.oP.YB) || !hautCritique.HasConverged()) {
                      //traduction de code de langue:
                      //this.oLog.Add(_T('hydraulic:h_critique')+' : '+_T('hydraulic:newton_non_convergence'),true);
                }
                return this.HautCritique;
        }
        /**
         * Calcul du tirant d'eau normal.
         * @return tirant d'eau normal
         */
        Calc_Yn() {
                if(this.oP.If <= 0) {
                        this.HautNormale = false;
                        //this.oLog.Add(_T('hydraulic:h_normale_pente_neg_nul'),true);
                } else {
                        var oHautNormale= new cHautNormale(this, this.oP);
                        if(!this.HautNormale == oHautNormale.Newton(this.CalcGeo('Yc')) || !oHautNormale.HasConverged()) {
                                //this.oLog.Add(_T('hydraulic:h_normale').' : '._T('hydraulic:newton_non_convergence'),true);
                        }
                }
                return this.HautNormale;
        }
        /**
         * Calcul du tirant d'eau fluvial.
         * @return tirant d'eau fluvial
         */
        Calc_Yf() {
                if(this.Y > this.CalcGeo('Yc')) {
                        return this.Y;
                }
                else {
                        var oHautCorrespondante= new cHautCorrespondante(this, this.oP);
                        return oHautCorrespondante.Newton(this.Calc('Yc')*2);
                }
        }
        /**
         * Calcul du tirant d'eau torrentiel.
         * @return tirant d'eau torrentiel
         */
        Calc_Yt() {
                if(this.Y < this.CalcGeo('Yc')) {
                        return this.Y;
                }
                else {
                        var oHautCorrespondante= new cHautCorrespondante(this, this.oP);
                        return oHautCorrespondante.Newton(this.CalcGeo('Yc')/2);
                }
        }
        /**
         * Calcul du tirant d'eau conjugué.
         * @return tirant d'eau conjugué
         */
        Calc_Yco() {
                var oHautConj= new cHautConjuguee(this, this.oP);
                // Choisir une valeur initiale du bon côté de la courbe
                if(this.Calc('Fr') < 1) {
                        // Ecoulement fluvial, on cherche la conjuguée à partir du tirant d'eau torrentiel
                        var Y0 = this.Calc('Yt');
                }
                else {
                        // Ecoulement torrentiel, on cherche la conjuguée à partir du tirant d'eau fluvial
                        Y0 = this.Calc('Yf');
                }
               /* if(!Yco = oHautConj->Newton(Y0) || !oHautConj.HasConverged()) {
                        //$this->oLog->Add(_T('hydraulic:h_conjuguee').' : '._T('hydraulic:newton_non_convergence'),true);
                }
                return Yco;*/ // c quoi Yco ?
        }
        /**
         * Calcul de la contrainte de cisaillement.
         * @return contrainte de cisaillement
         */
        Calc_Tau0() {
                return 1000 * this.oP.G * this.Calc('R') * this.Calc('J');
        }
        /**
         * Calcul de la distance du centre de gravité de la section à la surface libre
         * multiplié par la surface hydraulique
         * @return S x Yg
         */
        Calc_SYg($rY) {
                return Math.pow($rY,2) * this.LargeurBerge / 2;
        }
        /**
         * Calcul de la dérivée distance du centre de gravité de la section à la surface libre
         * multiplié par la surface hydraulique
         * @return S x Yg
         */
        Calc_dSYg($rY) {
                return $rY * this.LargeurBerge;
        }
        /**
         * Calcul de l'impulsion hydraulique.
         * @return Impulsion hydraulique
         */
        Calc_Imp() {
                return 1000 * (this.oP.Q * this.Calc('V') + this.oP.G * this.Calc('SYg'));
        }
        /**
         * Calcul de l'angle Alpha entre la surface libre et le fond pour les sections circulaires.
         * @return Angle Alpha pour une section circulaire, 0 sinon.
         */
        Calc_Alpha(){
                return 0;
        }
        /**
         * Calcul de la dérivée de l'angle Alpha entre la surface libre et le fond pour les sections circulaires.
         * @return Dérivée de l'angle Alpha pour une section circulaire, 0 sinon.
         */
        Calc_dAlpha(){
                return 0;
        }
        /**
         * Fournit les coordonnées des points d'une demi section pour le dessin
         * @return tableau de couples de coordonnées (x,y)
         */
        DessinCoordonnees() {
                var Pas = this.oP.YB / this.nbDessinPoints;
                var Points = new Array();
                this.Swap(true); // On mémorise les données hydrauliques en cours
                for(var Y=0; Y<this.oP.YB+Pas/2; Y=Y+Pas) {
                        //Y boolean or what ?
                        Points['x'][] = this.Calc('B',Y)/2;
                        Points['y'][] = Y;
                }
                // On restitue les données initiales
                this.Swap(false);
                return Points;
        }
            
}

