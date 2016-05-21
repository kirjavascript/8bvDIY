import '../scss/index.scss';
import * as d3 from './lib/d3';
import { mix as getMix, flavour } from './http';
import UI from 'html!../html/mxr.html';
import flav from 'html!../html/flav.html';

// init //

let mxr = d3.select('#mxr').html(UI);

// ?m=Pf5pSf
let mix = /m=([a-zA-Z0-9]*)/.exec(location.search);

if(mix) {

    getMix(mix[1], mixinfo => {
        mixinfo.forEach(d => {
            flavour(d.flavour, flavinfo => {
                addFlav(Object.assign(d, flavinfo));
            })
        })
    })

}

// selector caching

let [pg, vg, mg, pct, nicType, nicBase, vgOut, pgOut, nicOut, qty, add] = [
    mxr.select('#pg'),
    mxr.select('#vg'),
    mxr.select('#mg'),
    mxr.select('#pct'),
    mxr.select('#nicType'),
    mxr.select('#nicBase'),
    mxr.select('#vgOut'),
    mxr.select('#pgOut'),
    mxr.select('#nicOut'),
    mxr.select('#qty'),
    mxr.select('#add')
];



function update() {

    let conf = {
        pg: pg.property('value'),
        vg: vg.property('value'),
        mg: mg.property('value'),
        nicType: nicType.property('value'),
        nicBase: nicBase.property('value'),
        qty: qty.property('value')
    };

    function getAmt(num) {
        return (num*conf.qty/100).toFixed(2);
    }

    // calc

    let nicPct = (conf.mg / conf.nicBase * 100).toFixed(2);

    conf[conf.nicType] -= nicPct;

    d3.selectAll('.flav')
        .each(function(){
            let flav = d3.select(this);

            let type = flav.select('.nicType').property('value');

            let pct = flav.select('.pct').property('value');

            conf[type] -= pct;

            flav.select('.out').html(`${(+pct).toFixed(2)}% - ${getAmt(pct)}ml`)

        })


    nicOut.html(`${nicPct}% - ${getAmt(nicPct)}ml`);
    pgOut.html(`${(+conf.pg).toFixed(2)}% - ${getAmt(conf.pg)}ml`);
    vgOut.html(`${(+conf.vg).toFixed(2)}% - ${getAmt(conf.vg)}ml`);

}

update();

// flavour //

function addFlav (mixinfo) {
    let newFlav = d3.select('#flavs')
        .append('div')
        .attr('class','flav')
        .html(flav)

    let newPct = newFlav.select('.pct');

    if(mixinfo) {
        console.log(mixinfo)

        newFlav.select('.pct').property('value',mixinfo.amount)
        newFlav.select('.flavName')
            .property('value',mixinfo.description)
            .style('background-image',`url("https://8bitvape.co.uk/img/flavimg/${mixinfo.flavour}.png")`)

        newFlav.select('.flavInfo').style('display','inline')
    }

    update();

    newFlav.call(dropFade)

    // events

    newPct
        .on('keydown keyup change', function(){
            newFlav.select('.qty').property('value', this.value*qty.property('value')/100)
            update();
        })

    newFlav.select('.qty')
        .on('keydown keyup change', function(){
            newPct.property('value', this.value/qty.property('value')*100)
            update();
        })

    newFlav.select('.nicType')
        .on('keydown keyup change', update)

    newFlav.select('.remove')
        .on('click', () => {
            newFlav.call(jumpFade);
        })

    // init ml

    newFlav.select('.qty')
        .property('value', (newPct.property('value')*qty.property('value')/100).toFixed(2))

}

add.on('click',addFlav);

// config //

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
        if (this.value > nicBase.property('value')) {
            nicBase.property('value', this.value)
        }
        update();
    })

pct.on('keydown keyup change', function() {
        mg.property('value', this.value*10)
        update();
    })

// anim //

function dropFade(selection) {
    selection
        .style('opacity', 0)
        .style('margin-top', '-50px')
        .transition()
        .duration(750)
        .style('opacity', 1)
        .style('margin-top', '0px')
}

function jumpFade(selection) {
    selection
        .style('margin-top', '0px')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .style('margin-top', '-50px')
        .remove()
        .on('end', d => {update()})
}