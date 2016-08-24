
export class cLog {
        
        public txt;
        
        constructor() {
                this.txt = '';
        }
        
        Add(sTxt,bErr=false) {
        // peut on mettre des balises ?
            this.txt += '<li';
            if(bErr) {this.txt += ' class="hyd_erreur"';}
            this.txt += '>'+sTxt+'</li>';
        }
        Result() {
            if(this.txt!='') {
                return this.txt;
            } else {
                    return '';
            }
        }
}