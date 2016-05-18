import * as d3 from './lib/d3';

export function mixinfo(str, callback) {

    d3.text('https://8bitvape.co.uk/getmix.php?f='+str, (e,d) => {
        d = d.split(' ').map(d => {
            d = d.split(':');
            return {
                flavour:d[0],
                amount:d[1]
            }
        }).splice(1)

        console.log(d);
    })
}

export function flavourinfo(str, callback) {

    d3.text('https://8bitvape.co.uk/getflav.php?f='+str, (e,d) => {

        
        console.log(d);
    })
}