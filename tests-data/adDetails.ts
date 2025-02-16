export const adDetailsType = [
    {
        fields: [
            { name: 'asset_type', type: 'select' },
            { name: 'asset_status', type: 'select' },
            { name: 'city', type: 'select' },
            { name: 'street_number', type: 'text' }
        ]
    },
    {
        fields: [
            { name: 'floor', type: 'text' },
            { name: 'floors_amount', type: 'text' },
            { name: 'room_num', type: 'select' },
            { name: 'terrace', type: 'select' },
            { name: 'parking', type: 'select' },
            { name: 'built_mr', type: 'text' },
            { name: 'elevator', type: 'select' },
        ]
    },
    {
        fields: [
            { name: 'characteristics', type: 'checkable_photo' },
            { name: 'description', type: 'text' }

        ]
    },
    {
        fields: [
            { name: 'credits', type: 'text' },
            { name: 'house_committee', type: 'text' },
            { name: 'tax_asset', type: 'text' },
            { name: 'price', type: 'text' },
            { name: 'date_start', type: 'date' }
        ]
    },
    {
        fields: [
            { name: 'pictures', type: 'pictureFiles' },
        ]
    },
    {
        fields: [
            { name: 'name_full', type: 'text' },
            { name: 'phone_number', type: 'text' }

        ]
    }
]



export const adDetailsValue = {

    // page1
    asset_type: 'דירה',
    asset_status: 'משופץ',
    street_1: '',
    city: 'לוטם',
    street_number: '8', 
    
    // page2
    floor: '1',
    floors_amount: '', 
    room_num: '4',
    terrace: '1',
    parking: '1',
    built_mr: '130',
    elevator: 'ללא',
    
    // page3
    characteristics: ['מיזוג', 'משופצת', 'ממ"ד', 'סורגים'],
    description: 'Beautiful apartment',
    
    // page4
    credits: '12',
    house_committee: '100',
    tax_asset: '400',
    price: '5000',
    date_start: '1.3.2025',
    
    // page5
    pictures: ['tests-data\\apartment_photo.jpg'],
    
    // page6
    name_full: 'israel israeli',
    phone_number: '050-0000000',
  };

