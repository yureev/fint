var codes = [46, 8, 37, 39, 44, 190, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 83];
var char;
elem.on('keypress', function(e) {

    if (e.which == null)
        char= String.fromCharCode(e.keyCode);    // old IE
    else if (e.which != 0 && e.charCode != 0)
        char= String.fromCharCode(e.which);

    var charCode = e.keyCode ? e.keyCode : e.which;
    if( e.charCode !== 0 && codes.indexOf(e.charCode) === -1 ) {
        //console.log(1);
        e.preventDefault();
    }
    if ( e.keyCode !== 0 && codes.indexOf(e.keyCode) === -1 ) {
        //console.log(2);
        e.preventDefault();
    }

    if( ngModelController.$modelValue == "0" && charCode !==  46 && charCode !==  44 && charCode !==  8) {
        e.preventDefault();
    }

    if(!ngModelController.$modelValue && charCode == 44 || !ngModelController.$modelValue && charCode == 46) {
        e.preventDefault();
        return;
    }

    if(charCode == 44 || charCode == 46) {
        var el = elem[0];
        var decimalLength = el.value.length - el.selectionEnd;
        if (decimalLength > 2) {
            e.preventDefault();
            return;
        }
    }

    if(ngModelController.$modelValue == '0' && charCode == 48){
        e.preventDefault();
    }

    if(/(\,|\.)\d?/.test(ngModelController.$viewValue)){
        //console.log(charCode);
        if(charCode == 44 || charCode == 46) {
            e.preventDefault();
            return false;
        }
    }
    if(/(\,|\.)\d{2}/.test(ngModelController.$viewValue)){
        if(charCode == 8 || charCode == 37 || charCode == 39 || charCode == 46) {
            return e.returnValue;
        } else {
            e.preventDefault();
        }

    }
});