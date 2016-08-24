import {acSection} from "./section_type";

/**
 * Calculs de la section circulaire
 */
class cSnCirc extends acSection {
        
        public D;      /// Diamètre du cercle
        private Alpha;    /// Angle de la surface libre par rapport au fond
        protected nbDessinPoints=50;
        
        constructor(oLog,oP,D) {
                super(oLog,oP);
                this.D=D;
                if(oP.YB > D) {oP.YB = D;} // On place la berge au sommet du cercle
        }
        /**
         * Calcul de l'angle Alpha de la surface libre par rapport au fond.
         * @return Alpha
         */
        Calc_Alpha() {
                if(this.Y > this.oP.YB) {
                        var rY = this.oP.YB;
                }
                else {
                        rY = this.Y;
                }
                if(rY <= 0) {
                        return 0;
                }
                else if(rY > this.D) {
                        return Math.PI;
                }
                else {
                        var alpha = Math.acos(1.-rY/(this.D/2.));
                        if(alpha > Math.PI) {
                                return Math.PI;
                        }
                        else {
                                return alpha;
                        }
                }
        }
        /**
         * Calcul de dérivée de l'angle Alpha de la surface libre par rapport au fond.
         * @return dAlpha
         */
        Calc_dAlpha() {
                if(this.Y <= 0 || this.Y >= this.D || this.Y > this.oP.YB) {
                        return 0;
                }
                else {
                        return 2. / this.D / Math.sqrt(1. - Math.pow(1. - 2. * this.Y / this.D,2));
                }
        }
        /**
         * Calcul de la largeur au miroir.
         * @return B
         */
        Calc_B() {
                if(this.Y > this.oP.YB) {
                        return super.Calc_B();
                }
                else {
                        return this.D * Math.sin(this.Calc('Alpha'));
                }
        }
        /**
         * Calcul du périmètre mouillé.
         * @param $rY Uniquement présent car la méthode parent a cet argument
         * @return B
         */
        Calc_P($rY=0) {
                if(this.Y > this.oP.YB && !this.bSnFermee) {
                        // On n'ajoute pas le périmètre dans le cas d'une fente de Preissmann
                        return this.CalcGeo('P') + super.Calc_P(this.Y-this.oP.YB);
                }
                else {
                        return this.D * this.Calc('Alpha');
                }
        }
        /**
         * Calcul de la surface mouillée.
         * @param $rY Uniquement présent car la méthode parent a cet argument
         * @return S
         */
        Calc_S($rY=0) {
                if(this.Y > this.oP.YB) {
                        return this.CalcGeo('S') + super.Calc_S(this.Y-this.oP.YB);
                }
                else {
                        return Math.pow(this.D,2) / 4 * (this.Calc('Alpha') - Math.sin(this.Calc('Alpha')) * Math.cos(this.Calc('Alpha')));
                }
        }
        /**
         * Calcul de dérivée de la surface hydraulique par rapport au tirant d'eau.
         * @return dS
         */
        Calc_dS() {
                if(this.Y > this.oP.YB) {
                        return super.Calc_dS();
                }
                else {
                        return Math.pow(this.D,2) / 4 * this.Calc('dAlpha') * (1 - Math.cos(2 * this.Calc('Alpha')));
                }
        }
        /**
         * Calcul de dérivée du périmètre hydraulique par rapport au tirant d'eau.
         * @return dP
         */
        Calc_dP() {
                if(this.Y > this.oP.YB && !this.bSnFermee) {
                        return super.Calc_dP();
                }
                else {
                        return this.D * this.Calc('dAlpha');
                }
        }
        /**
         * Calcul de dérivée de la largeur au miroir par rapport au tirant d'eau.
         * @return dB
         */
        Calc_dB() {
                if(this.Y > this.oP.YB) {
                        return super.Calc_dB();
                }
                else {
                        return this.D * this.Calc('dAlpha') * Math.cos(this.Calc('Alpha'));
                }
        }
        /**
         * Calcul de la distance du centre de gravité de la section à la surface libre
         * multiplié par la surface hydraulique
         * @param $rY Uniquement présent car la méthode parent a cet argument
         * @return S x Yg
         */
        Calc_SYg($rY=0) {
                var SYg = Math.sin(this.Calc('Alpha'))-Math.pow(Math.sin(this.Calc('Alpha')),3) / 3 - this.Calc('Alpha') * Math.cos(this.Calc('Alpha'));
                SYg = Math.pow(this.D,3) / 8 * SYg;
                return SYg;
        }
        /**
         * Calcul de la dérivée de la distance du centre de gravité de la section à la surface libre
         * multiplié par la surface hydraulique
         * @param $rY Uniquement présent car la méthode parent a cet argument
         * @return S x Yg
         */
        Calc_dSYg($rY=0) {
                var cos = Math.cos(this.Calc('Alpha'));
                var sin = Math.sin(this.Calc('Alpha'));
                var SYg = this.Calc('dAlpha') * cos;
                SYg += - this.Calc('dAlpha') * cos * Math.pow(sin,2);
                SYg += - this.Calc('dAlpha') * cos + this.Calc('Alpha') * this.Calc('dAlpha') * sin;
                SYg = 3 * Math.pow(this.D,3) / 8 * SYg;
                return SYg;
        }
}