import * as d3 from './lib/d3';

export function mix(str, callback) {

    d3.text('https://8bitvape.co.uk/getmix.php?f='+str, (e,d) => {
        d = d.split(' ').map(d => {
            d = d.split(':');
            return {
                flavour:d[0],
                amount:d[1]
            }
        }).splice(1)

        callback(d);
    })
}

export function flavour(str, callback) {

    d3.json('https://8bitvape.co.uk/getflav.php?f='+str, (e,d) => {

        
        callbak(d);
    })
}