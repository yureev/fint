function Provider() {
    var urls = {
        getTariffs: '',
        getPayStatus: '',
        finishlookup: '',
        getDateTime: '',
        getlinkparams: '',
        createCard2CardOperation: '',
        generateLink: '',
        sendtomail: '',
        createCard2PhoneOperation: '',
        phone2Card: '',
        tocardlink: '',
        kvitanse: ''
    };
    
    var type = 'web';
    var linkPrefix = ''
    var recieptTemplate = '';

    this.setUrls = function (data) {
        urls = data;
    };

    this.setType = function (data) {
        type = data;
    };

    this.setLinkPrefix = function (data) {
        linkPrefix = data;
    };

    this.setRecieptTemplate = function (template) {
        recieptTemplate = template;
    };

    this.$get = function () {
        return {
            urls: urls,
            type: type,
            linkPrefix: linkPrefix,
            recieptTemplate: recieptTemplate
        }
    }
}

module.exports = Provider;