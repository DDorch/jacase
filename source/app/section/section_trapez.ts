import {acSection} from "./section_type";

/**
 * Calculs de la section trapézoïdale
 */
export class cSnTrapez extends acSection {
        public LargeurFond;    /// Largeur au fond
        public Fruit;          /// Fruit des berges
        constructor(oLog,oP,LargeurFond, Fruit) {
                super(oLog,oP);
                this.LargeurFond=LargeurFond;
                this.Fruit=Fruit;
        }
        
        Calc_B(bBerge=false) {
                if(!bBerge && this.Y > this.oP.YB) {
                        return this.LargeurBerge;
                }
                else {
                        return this.LargeurFond+2*this.Fruit*this.Y;
                }
        }
        /**
         * Calcul du périmètre mouillé
         * @param $rY Uniquement présent car la méthode parent à cet argument
         * @return Périmètre mouillé (m)
         */
        Calc_P($rY=0) {
                if(this.Y > this.oP.YB) {
                        var P = this.CalcGeo('P') + super.Calc_P(this.Y-this.oP.YB);
                }
                else {
                        P = this.LargeurFond+2*Math.sqrt(1+Math.pow(this.Fruit,2))*this.Y;
                }
                //~ spip_log('Trapez->CalcP(rY='.$this->rY.')='.$P,'hydraulic.'._LOG_DEBUG);
                return P;
        }
        /**
         * Calcul de la surface mouillée
         * @param $rY Uniquement présent car la méthode parent à cet argument
         * @return Surface mouillée (m2)
         */
        Calc_S($rY=0) {
                if(this.Y > this.oP.YB) {
                        var S = this.CalcGeo('S') + super.Calc_S(this.Y-this.oP.YB);
                }
                else {
                        S = this.Y*(this.LargeurFond+this.Fruit*this.Y);
                }
                //~ spip_log('Trapez->CalcS(rY='.$this->rY.')='.$S,'hydraulic.'._LOG_DEBUG);
                return S;
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
                        return this.LargeurFond + 2*this.Fruit*this.Y;
                }
        }
        /**
         * Calcul de dérivée du périmètre hydraulique par rapport au tirant d'eau.
         * @return dP
         */
        Calc_dP() {
                if(this.Y > this.oP.YB) {
                        return super.Calc_dP();
                }
                else {
                        return 2*Math.sqrt(1+this.Fruit*this.Fruit);
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
                        return 2*this.LargeurFond*this.Fruit;
                }
        }
        /**
         * Calcul de la distance du centre de gravité de la section à la surface libre
         * multiplié par la surface hydraulique
         * @param $rY Uniquement présent car la méthode parent à cet argument
         * @return S x Yg
         */
        Calc_SYg($rY=0) {
                return (this.LargeurFond / 2 + this.Fruit * this.Y / 3) * Math.pow(this.Y,2);
        }
        /**
         * Calcul de la dérivée de la distance du centre de gravité de la section à la surface libre
         * multiplié par la surface hydraulique
         * @param $rY Uniquement présent car la méthode parent à cet argument
         * @return S x Yg
         */
        Calc_dSYg($rY=0) {
                var SYg = this.Fruit / 3 * Math.pow(this.Y,2);
                SYg += (this.LargeurFond / 2 + this.Fruit * this.Y / 3) * 2 * this.Y;
                return SYg;
        }
}