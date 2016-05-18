import '../scss/index.scss';
import * as d3 from './lib/d3';
import { mixinfo } from './http';
import UI from 'html!../html/mxr.html';

//mixinfo('Pf5pSf');

let mxr = d3.select('#mxr').html(UI);

let [pg, vg, mg, pct, nicType, nicBase, vgOut, pgOut, nicOut, qty] = [
    mxr.select('#pg'),
    mxr.select('#vg'),
    mxr.select('#mg'),
    mxr.select('#pct'),
    mxr.select('#nicType'),
    mxr.select('#nicBase'),
    mxr.select('#vgOut'),
    mxr.select('#pgOut'),
    mxr.select('#nicOut'),
    mxr.select('#qty')
];



function update() {

    let conf = {
        pg: pg.property('value'),
        vg: vg.property('value'),
        mg: mg.property('value'),
        //pct: pct.property('value'),
        nicType: nicType.property('value'),
        nicBase: nicBase.property('value'),
        qty: qty.property('value')
    };

    function getAmt(num) {
        return (num*conf.qty/100).toFixed(2);
    }

    let nicPct = (conf.mg / conf.nicBase * 100).toFixed(2);

    // flavours just subtract from the vg percent
    conf[conf.nicType] -= nicPct;


    nicOut.html(`${nicPct}% - ${getAmt(nicPct)}ml`);
    pgOut.html(`${(+conf.pg).toFixed(2)}% - ${getAmt(conf.pg)}ml`);
    vgOut.html(`${(+conf.vg).toFixed(2)}% - ${getAmt(conf.vg)}ml`);

}

update();

// events //

mxr.selectAll('#qty, #nicBase, #nicType')
    .on('keydown keyup change', update)

pg.on('keydown keyup change', function() {
        vg.property('value', 100-this.value)
        update();
    })

vg.on('keydown keyup change', function() {
        pg.property('value', 100-this.value)
        update();
    })

mg.on('keydown keyup change', function() {
        pct.property('value', this.value/10)
        update();
    })

pct.on('keydown keyup change', function() {
        mg.property('value', this.value*10)
        update();
    })