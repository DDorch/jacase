import {cLog} from './log';

export class cDichotomie {
        private oLog : cLog; ///< Journal de calcul
        IDEFINT = 100; ///< Pas de parcours de l'intervalle pour initialisation dichotomie
        IDICMAX = 100; ///< Itérations maximum de la dichotomie
        private objet = new Object(); ///< Objet contenant la méthode de calcul du débit
        private sFnCalculQ; ///< Nom de la méthode de calcul du débit
        /**
        * Construction de la classe.
        * @param $oLog Journal de calcul
        * @param $objet Objet contenant la méthode de calcul du débit et la
        *      propriété VarCal pointeur vers la variable à calculer
        * @param $sFnCalculQ Nom de la méthode de calcul du débit
        */
        constructor(oLog,objet,sFnCalculQ) {
                this.oLog = oLog;
                this.objet = objet;
                this.sFnCalculQ = sFnCalculQ;
        }
        
        CalculQ() {
                var sFnCalculQ = this.sFnCalculQ;
                var res = this.objet[sFnCalculQ]();
                if(!Array.isArray(res)) {
                        res = new Array(res,-1);
                }
                //spip_log('CalculQ('.$this->objet->VarCal.')='.$res[0],'hydraulic',_LOG_DEBUG);
                return res;
        }
        
        XOR(a,b) {
             return ( a || b ) && !( a && b );
        }
        /**
        * Calcul à l'ouvrage
        * @param $sCalc Variable à calculer (Nom de la propriété de l'objet)
        * @param $QT Débit cible
        * @param $rTol Précision attendue
        * @param $rInit Valeur initiale
        */
        calculer(QT,rTol,rInit) {
                var result;
                var XminInit = 1E-8;
                this.objet['idCal'] = XminInit;
                var res = this.CalculQ();
                var Q1=res[0];
                var nFlag=res[1];
                var XmaxInit = Math.max(1,rInit)*100;
                this.objet['idCal'] = XmaxInit;
                res = this.CalculQ();
                var Q2 = res[0];
                nFlag = res[1];
                var DX = (XmaxInit - XminInit) / this.IDEFINT;
                var nIterMax = Math.floor(Math.max(XmaxInit - rInit,rInit - XminInit) / DX + 1);
                var Xmin = rInit;
                var Xmax = rInit;
                var X1 = rInit;
                var X2 = rInit;
                this.objet['idCal'] = rInit;
                res = this.CalculQ();
                var Q=res[0];
                nFlag=res[1];
                var Q1 = Q;
                var Q2 = Q;
                ///< @todo : Chercher en dehors de l'intervalle en le décalant à droite ou à gauche en fonction de la valeur
                for(var nIter=1;nIter<nIterMax;nIter++) {
                        //Ouverture de l'intervalle des deux côtés : à droite puis à gauche
                        Xmax = Xmax + DX;
                        if(this.XOR(Xmax > XmaxInit,DX <= 0)) Xmax = XmaxInit;
                        this.objet['idCal'] = Xmax;
                        [Q,nFlag] = this.CalculQ();
                        if(this.XOR(Q1 < Q2,Q <= Q2)) {
                                Q2 = Q;
                                X2 = Xmax;
                        }
                        if(this.XOR(Q1 < Q2,Q >= Q1)) {
                                Q1 = Q;
                                X1 = Xmax;
                        }
                        Xmin = Xmin - DX;
                        if(this.XOR(Xmin < XminInit , DX <= 0)) {
                                Xmin = XminInit;
                        }
                        this.objet['idCal'] = Xmin;
                        [Q,nFlag] = this.CalculQ();
                        if(this.XOR(Q1 < Q2,Q <= Q2)) {
                                Q2 = Q;
                                X2 = Xmin;
                        }
                        if(this.XOR(Q1 < Q2,Q >= Q1)) {
                                Q1 = Q;
                                X1 = Xmin;
                        }
                        if(this.XOR(QT > Q1 , QT >= Q2)) {break;}
                }
                if(nIter >= this.IDEFINT) {
                        // Pas d'intervalle trouvé avec au moins une solution
                        if(Q2 < QT && Q1 < QT) {
                                // Cote de l'eau trop basse pour passer le débit il faut ouvrir un autre ouvrage
                                this.objet['idCal'] = XmaxInit;
                        }
                        else {
                                // Cote de l'eau trop grande il faut fermer l'ouvrage
                                this.objet['idCal'] = XminInit;
                        }
                        [Q,nFlag] = this.CalculQ();
                        nFlag = -1;
                        //var sLog = ($Q1<$Q2)?"Q($X1)=$Q1 &lt; Q($X2)=$Q2":"Q($X2)=$Q2 &lt; Q($X1)=$Q1";
                        //var sLog = ($QT<$Q1)?"$QT &lt; $sLog":"$sLog &lt; $QT";
                        /*$this->oLog->Add(_T('hydraulic:dichotomie_intervalle').' : '.
                        $sLog,true);*/
                }
                else {
                        // Dichotomie
                        var X = rInit;
                        for(nIter = 1; nIter<=this.IDICMAX; nIter++) {
                                this.objet['idCal'] = X;
                                [Q,nFlag] = this.CalculQ();
                                //~ if($QT!=0 && abs($Q/$QT-1.) <= $rTol) {break;}
                                if(QT!=0 && Math.abs(X1-X2) <= rTol) {break;}
                                if(this.XOR(QT < Q , Q1 <= Q2)) {
                                        // QT < IQ et Q(X1) > Q(X2) ou pareil en inversant les inégalités
                                        X1 = this.objet['idCal'] ;
                                }
                                else {
                                        // QT < IQ et Q(X1) < Q(X2) ou pareil en inversant les inégalités
                                        X2 = this.objet['idCal'] ;
                                }
                                X=(X2+X1)*0.5;
                        }
                        if(nIter == this.IDICMAX) {
                               /* $this->oLog->Add(
                                        _T('hydraulic:dichotomie_non_convergence').' '.format_nombre($Q, $this->data['iPrec']),
                                true);*/
                                nFlag = -1;
                        }
                }
                return new Array(this.objet['idCal'],nFlag);
        }
}