import {cParam} from "./section_type"

export abstract class acNewton {
        protected rTol;
        protected Dx;
        private iCpt=0;
        private iCptMax=50;
        private rRelax=1; /// Coefficient de relaxation
        private rFnPrec=0; /// Mémorisation du Fn précédent pour détecter le changement de signe
        private iOscil=0; /// Nombre de changement de signe de Delta
        private oLog;
        /**
         * Constructeur de la classe
         * @param $oSn Section sur laquelle on fait le calcul
         * @param $oP Paramètres supplémentaires (Débit, précision...)
         */
        constructor(oP: cParam) {
                this.rTol=oP.Prec;
                this.Dx=oP.Prec/10;
        }
        /**
         * Calcul de la fonction f(x) dont on cherche le zéro.
         * @param $rX x
         * @return Calcul de la fonction
         */
        abstract CalcFn(rX);
        /**
         * Calcul de la dérivée f'(x) (peut être redéfini pour calcul analytique)
         * @param $rX x
         * @return Calcul de la fonction
         */
        protected CalcDer($x) {
                //~ spip_log('Newton:CalcDer $rX='.$x,'hydraulic.'._LOG_DEBUG);
                return (this.CalcFn($x+this.Dx)-this.CalcFn($x-this.Dx))/(2*this.Dx);
        }
        /**
         * Test d'égalité à une tolérance près
         * @param $rFn x
         * @return True si égal, False sinon
         */
        private FuzzyEqual($rFn) {
                return (Math.abs($rFn) < this.rTol);
        }
        /**
         * Fonction récursive de calcul de la suite du Newton
         * @param $rX x
         * @return Solution du zéro de la fonction
         */
        XOR(a,b) {
             return ( a || b ) && !( a && b );
        }

        public Newton($rX) {
                this.iCpt++;
                var rFn=this.CalcFn($rX);
                if(this.FuzzyEqual(rFn) || this.iCpt >= this.iCptMax) {
                        return $rX;
                }
                else {
                        var rDer=this.CalcDer($rX);
                        //~ echo(' - f\' = '.$rDer);
                        if(rDer!=0) {
                                if(this.XOR(rFn < 0 , this.rFnPrec < 0)) {
                                        this.iOscil++;
                                        if(this.rRelax > 1) {
                                                // Sur une forte relaxation, au changement de signe on réinitialise
                                                this.rRelax = 1;
                                        }
                                        else if(this.iOscil>2) {
                                                // On est dans le cas d'une oscillation autour de la solution
                                                // On réduit le coefficient de relaxation
                                                this.rRelax = this.rRelax * 0.5;
                                        }
                                }
                                this.rFnPrec = rFn;
                                var Delta = rFn / rDer;
                                //2^8 = 2E8 ?
                                while(Math.abs(Delta*this.rRelax) < this.rTol && rFn > 10*this.rTol && this.rRelax < 2E8) {
                                        // On augmente le coefficicient de relaxation s'il est trop petit
                                        this.rRelax = this.rRelax *2;
                                }
                                var rRelax = this.rRelax;
                                while($rX - Delta*rRelax <= 0 && rRelax > 1E-4) {
                                        // On diminue le coeficient de relaxation si on passe en négatif
                                        rRelax =rRelax * 0.5; // Mais on ne le mémorise pas pour les itérations suivantes
                                }
                                $rX = $rX - Delta*rRelax;
                                //this.rDelta = Delta; ???
                                if($rX<0) {$rX = this.rTol;} // Aucune valeur recherchée ne peut être négative ou nulle
                                return this.Newton($rX);
                        }
                        else {
                                // Echec de la résolution
                                return false;
                        }
                }
        }
        /**
         * Pour savoir si le Newton a convergé
         * @return true si oui, false sinon
         */
         public HasConverged() {
                if(this.iCpt >= this.iCptMax) {
                        return false;
                }
                else {
                        return true;
                }
        }
}