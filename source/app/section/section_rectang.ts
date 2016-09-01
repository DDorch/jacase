import {acSection} from "./section_type";

/**
 * Calculs de la section rectangulaire
 */
export class cSnRectang extends acSection {
        constructor(oLog,oP,LargeurFond) {
                super(oLog,oP);
                this.LargeurBerge = LargeurFond;
        }
        /**
         * Calcul du périmètre mouillé
         * @param $rY Uniquement présent car la méthode parent à cet argument
         * @return Périmètre mouillé (m)
         */
        Calc_P($rY=0) {
                return this.LargeurBerge + super.Calc_P(this.Y);
        }

        /**
         * Calcul du tirant d'eau conjugué avec la formule analytique pour la section rectangulaire
         * @return tirant d'eau conjugué
         */
        CalcYco() {
                return this.Y*(Math.sqrt(1 + 8 * Math.pow(this.Calc('Fr'),2)) - 1) / 2;
        }
}