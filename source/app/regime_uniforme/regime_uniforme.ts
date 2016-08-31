import {Component} from '@angular/core';
import {FormSection} from '../section/form_section';
import {FORM_DIRECTIVES,CORE_DIRECTIVES} from '@angular/common';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {Http} from '@angular/http';
import {PipeNumbers} from '../common/pipe_numbers';
import {PipeNumberValidator} from '../common/pipe_number_validator';

@Component({
    selector: 'jacase',
    pipes: [PipeNumbers,PipeNumberValidator],
    templateUrl: 'app/common/formulaire.html',
    styleUrls:['app/main.css'],
    directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor, FormSection],
})

export class FormRegimeUniforme extends FormSection {
    
    constructor(public http: Http){
        super(http,'regime_uniforme');
    }
        /**
        * Calcul du débit en régime uniforme.
        * @return Débit en régime uniforme
        */
        Calc_Qn() {
            this.Sn.Reset(true);
            if(this.oP.If <= 0) {
                    var  Qn = 0; // ? false bool
                    //this.oLog.Add('h_normale_pente_neg_nul',true);
            } else {
                    Qn = this.oP.Ks*Math.pow(this.Sn.Calc('R',this.Sn.Y),2/3)*this.Sn.Calc('S',this.Sn.Y)*Math.sqrt(this.oP.If);
            }
            return Qn;
        }

        /*calculate() {
                //this.creer_section_param();
                // On transforme les champs du tableau des données du formulaire en variables
                //extract($this->data, EXTR_OVERWRITE|EXTR_REFS);
                if(this.varVar && this.varVar != ''){
                        // Pointage de la variable qui varie sur le bon attribut
                        if(this.varVar == 'Y' || in_array($ValVar, this.get_champs_section($choix_section))){
                                this.Sn.ValVar = &$i;
                        }
                        else{
                                $this->oP->{$ValVar} = &$i;
                        }
                }
                if(!in_array($ValCal,array('rY','rQ'))) {
                        // Le calcul se fera par dichotomie
                        include_spip('hyd_inc/dichotomie.class');
                        $oDicho = new cDichotomie($this->oLog,$this,'Calc_Qn');
                        // Pointage de la variable à calculer sur le bon attribut
                        spip_log($ValCal,'hydraulic',_LOG_DEBUG);
                        if(in_array($ValCal, $this->get_champs_section($choix_section))){
                                $this->VarCal = &$this->oSn->{$ValCal};
                        }
                        else{
                                $this->VarCal = &$this->oP->{$ValCal};
                        }
                }
                $tRes = array(); // Tableau des résultats (ordonnées)
                $tAbs = array(); // Tableau des abscisses
                for($i = $min; $i < $max; $i+= $pas){
                        spip_log("min=$min max=$max i=$i",'hydraulic',_LOG_DEBUG);
                        $tAbs[] = $i;
                        switch($ValCal) {
                                case 'rY':
                                $tRes[] = $this->oSn->Calc('Yn');
                                break;
                                case 'rQ':
                                $tRes[] = $this->Calc_Qn();
                                break;
                                default :
                                if(end($tRes)!==false) {
                                        // Solution initiale = dernière solution trouvée
                                        $rInit = end($tRes);
                                } else {
                                        // Solution initiale = Valeur saisie pour la variable à calculer
                                        $rInit = $$ValCal;
                                }
                                list($tRes[],$flag) = $oDicho->calculer($rQ,$rPrec,$rInit);
                        }
                }
                return array('abs'=>$tAbs,'res'=>$tRes);
        }    

    }*/
}