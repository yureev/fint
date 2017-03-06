angular.module('component-cardtocard', [])
    .controller('CardToCard', require('./controllers/card_to_card'))
    .controller('CardToCardInput', require('./controllers/card_to_card_input'))
    .controller('CardToCardLookup', require('./controllers/card_to_card_lookup'))
    .controller('CardToCardSuccess', require('./controllers/card_to_card_success'))
    .controller('CardToCard3dsecure', require('./controllers/card_to_card_3dsecure'))

    .controller('getByLink', require('./controllers/get_by_link'))
    .controller('getByLinkInput', require('./controllers/get_by_link_input'))
    .controller('getByLinkSend', require('./controllers/get_by_link_send'))

    .controller('PhoneToCardInput', require('./controllers/phone_to_card_input.js'))
    .controller('PhoneToCardConfirm', require('./controllers/phone_to_card_confirm.js'))
    
    .provider('CardToCard', require('./providers/card_to_card'));


