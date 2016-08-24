import {acSection} from "./section_type";

/**
 * Calculs de la section parabolique ou "puissance"
 */
class cSnPuiss extends acSection {
        public k;      /// Coefficient de forme compris entre 0 et 1
        //$LargeurBerge => La largeur des berges est déjà présente dans acSection
        protected nbDessinPoints=50;
        
        constructor(oLog,oP,rk,LargeurBerge) {
                super(oLog,oP);
                this.k = rk;
                this.LargeurBerge = LargeurBerge;
        }
        /**
         * Calcul de Lambda (mais on garde la routine Alpha commune avec la section circulaire)
         * @return Lambda
         */
        Calc_Alpha() {
                return this.LargeurBerge/Math.pow(this.oP.YB,this.k);
        }
        /**
         * Calcul de la largeur au miroir.
         * @return B
         */
        Calc_B() {
                if(this.Y >= this.oP.YB) {
                        return this.LargeurBerge;
                }
                else {
                        return this.Calc('Alpha')*Math.pow(this.Y,this.k);
                }
        }
        /**
         * Calcul du périmètre mouillé.
         * @param $rY Uniquement présent car la méthode parent a cet argument
         * @return B
         */
        Calc_P($rY=0) {
                var n=100; /// Le nombre de partie pour le calcul de l'intégrale
                var Lambda2 = Math.pow(this.Calc('Alpha'),2);
                var P = 0; /// Le périmètre à calculer
                var Previous = 0;
                for(var i=1; i<=n; i++) {
                        var Current = Math.pow(this.Y*i/n,this.k)/2;
                        P += Math.sqrt(Math.pow(n,-2)+Lambda2*Math.pow(Current-Previous,2));
                        Previous = Current;
                }
                P *= 2 ;
                return P;
        }
        /**
         * Calcul de la surface mouillée.
         * @param $rY Uniquement présent car la méthode parent a cet argument
         * @return S
         */
        Calc_S($rY=0) {
                return this.Calc('Alpha')*Math.pow(this.Y, this.k+1)/(this.k+1);
        }
        /**
         * Calcul de dérivée du périmètre hydraulique par rapport au tirant d'eau.
         * @return dP
         */
        Calc_dP() {
                return 2 * Math.sqrt(1+Math.pow(this.k*this.Calc('Alpha')/2,2)*Math.pow(this.Y,2*(this.k-1)));
        }
        /**
         * Calcul de dérivée de la largeur au miroir par rapport au tirant d'eau.
         * @return dB
         */
        Calc_dB() {
                return this.Calc('Alpha')*this.k*Math.pow(this.Y,this.k-1);
        }
        /**
         * Calcul de la distance du centre de gravité de la section à la surface libre
         * multiplié par la surface hydraulique
         * @param $rY Uniquement présent car la méthode parent a cet argument
         * @return S x Yg
         */
        Calc_SYg($rY=0) {
                return this.Calc('Alpha')*Math.pow(this.Y, this.k+2)/((this.k+1)*(this.k+2));
        }
        /**
         * Calcul de la dérivée distance du centre de gravité de la section à la surface libre
         * multiplié par la surface hydraulique
         * @param $rY Uniquement présent car la méthode parent a cet argument
         * @return S x Yg
         */
        Calc_dSYg($rY=0) {
                var SYg = this.Calc('dAlpha')*Math.pow(this.Y, this.k+2) + this.Calc('Alpha')*Math.pow(this.Y, this.k+1)*(this.k+2);
                return SYg/((this.k+1)*(this.k+2));
        }
}