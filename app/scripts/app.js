'use strict';

var React = require('react/addons');
var doSubmitForm = require('../../utils/submitform');
var getDistance = require('../../utils/getdistance');
var config = require('../../config');
var pkg = require('../../package.json');
var versionNumber = config.formId + '-' + pkg.version;

function showTransportform(state){
  var className = 'hidden';
  if(state !== ''){
    className = '';
  }
  return className;
}

function showTransportselskap(state){
  var className = 'hidden';
  if(state === 'Buss'){
    className = '';
  }
  return className;
}

function showBusskortvalg(state){
  console.log(state);
  var className = 'hidden';
  if(state !== 'Telemark Bilruter/Telemarksekspressen/Haukeliekspressen' && state !== ''){
    className = '';
  }
  return className;
}

function showBusskortNummer(state){
  var className = 'hidden';
  if(state === 'Har busskort'){
    className = '';
  }
  return className;
}

function showEksternSkoleAdresse(state){
  var className = 'hidden';
  if(state === 'Skole utenfor Telemark'){
    className = '';
  }
  return className;
}

function showTransportBuss(state){
  var className = 'hidden';
  if(state !== 'Skole utenfor Telemark'){
    className = '';
  }
  return className;
}

function showTransportFerge(state){
  var className = 'hidden';
  if(state !== 'Skole utenfor Telemark'){
    className = '';
  }
  return className;
}

function showTransportTog(state){
  var className = 'hidden';
  if(state !== 'Skole utenfor Telemark'){
    className = '';
  }
  return className;
}

var App = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return config.initialState;
  },
  componentDidUpdate: function(prevProps, prevState) {
    localStorage[config.formId] = JSON.stringify(this.state);
  },
  componentDidMount: function() {
    if (localStorage.getItem(versionNumber)) {
      this.setState(JSON.parse(localStorage.getItem(versionNumber)));
    }
  },
  cleanUp: function(){
    localStorage.clear();
    this.setState(config.initialState);
  },
  cancelForm: function(e){
    e.preventDefault();
    this.cleanUp();
  },
  submitForm: function(e) {
    e.preventDefault();
    var self = this;
    var payload = {
      personnummer: this.state.personnummer,
      navn: this.state.navn,
      adresse: this.state.adresse,
      telefon: this.state.telefon,
      skole: this.state.skole,
      klassetrinn: this.state.klassetrinn,
      transportform: this.state.transportform,
      transporter: this.state.transporter,
      busskortstatus: this.state.busskortstatus,
      busskortnummer: this.state.busskortnummer,
      holdeplassHjem: this.state.holdeplassHjem,
      holdeplassSkole: this.state.holdeplassSkole,
      eksternSkoleNavn: this.state.eksternSkoleNavn,
      eksternSkoleAdresse: this.state.eksternSkoleAdresse,
      utregnetAvstand: this.state.utregnetAvstand,
      utregnetAvstandAdresse: this.state.utregnetAvstandAdresse,
      utregnetAvstandSkole: this.state.utregnetAvstandSkole,
      utregnetAvstandKart: this.state.utregnetAvstandKart,
      formId: config.formId,
      formVersion: pkg.version
    };
    doSubmitForm(payload, function(err, data){
      if (err) {
        console.error(err);
      } else {
        self.cleanUp();
      }
    });
  },
  calculateDistance: function(){
    var self = this;
    var hjemsted = this.state.adresse;
    var skole = this.refs.skoleValg.getDOMNode().value;

    if (skole === 'Skole utenfor Telemark' || skole === '') {
      self.setState({
        skole: skole
      });
    } else {
      getDistance({origin:hjemsted, destination:skole}, function(err, data) {
        console.log(data);
        self.setState({
          skole: skole,
          utregnetAvstand: {kilometer:data.distance, meter: data.distanceValue},
          utregnetAvstandAdresse: data.origin,
          utregnetAvstandSkole: data.destination,
          utregnetAvstandKart: data.directionsEmbedUrl
        });
      });
    }
  },
  render: function(){
    return (
      <div>
      <h1>Skoleskyss</h1>
        <form onSubmit={this.submitForm}>
          <fieldset>
            <legend>Personalia</legend>
          <label htmlFor="personnummer">Personnummer (11 siffer)</label>
          <input type="text" name="personnummer" placeholder="18119169298" id="personnummer" valueLink={this.linkState('personnummer')} />
            <label htmlFor="navn">Navn</label>
            <input type="text" name="navn" placeholder="Fornavn, mellomnavn og etternavn" id="navn" valueLink={this.linkState('navn')} />
            <label htmlFor="adresse">Adresse</label>
            <input type="text" name="adresse" placeholder="Gateadresse, postnummer og poststed" id="adresse" valueLink={this.linkState('adresse')} />
            <label htmlFor="telefon">Telefon</label>
            <input type="text" name="telefon" placeholder="Mobilnummer/Telefonnummer" id="telefon" valueLink={this.linkState('telefon')} />
          </fieldset>
          <fieldset>
            <legend>Skole</legend>
            <select name="skole" ref="skoleValg" onChange={this.calculateDistance}>
              <option value="">Velg skole</option>
              <option value="Bamble videregående skole, Tønderveien 6, 3960 Stathelle">
                Bamble videregående skole
              </option>
              <option value="Bø videregåande skule, Gymnasbakken 23, 3802 Bø">
                Bø videregåande skule
              </option>
              <option value="Hjalmar Johansen videregående skole, Moflatvegen 38, 3733 Skien">
                Hjalmar Johansen videregående skole
              </option>
              <option value="Kragerø videregående skole, Frydensborgveien 9-11, 3770 Kragerø">
                Kragerø videregående skole
              </option>
              <option value="Nome videregående skole, Søveveien 8, 3830 Ulefoss">
                Nome videregående skole
              </option>
              <option value="Notodden videregående skole, Heddalsveien 4, 3674 Notodden">
                Notodden videregående skole
              </option>
              <option value="Porsgrunn videregående skole, Kjølnes Ring 58, 3918 Porsgrunn">
                Porsgrunn videregående skole
              </option>
              <option value="Rjukan videregående skole, Såheimveien 22, 3660 Rjukan">
                Rjukan videregående skole
              </option>
              <option value="Skien videregående skole, Einar Østvedts gate 12, 3724 Skien">
                Skien videregående skole
              </option>
              <option value="Skogmo videregående skole, Kjørbekkdalen 11, 3735 Skien">
                Skogmo videregående skole
              </option>
              <option value="Vest-Telemark vidaregåande skule, Storvegen 195, 3880 Dalen">
                Vest-Telemark vidaregåande skule
              </option>
              <option value="Skole utenfor Telemark">Skole utenfor Telemark</option>
            </select>
          </fieldset>
          <fieldset className={showEksternSkoleAdresse(this.state.skole)}>
            <label htmlFor="eksternSkoleNavn">Skolens navn</label>
            <input type="text" name="eksternSkoleNavn" placeholder="Navn på skolen" id="eksternSkoleNavn" valueLink={this.linkState('eksternSkoleNavn')} />
          </fieldset>
          <fieldset className={showEksternSkoleAdresse(this.state.skole)}>
            <label htmlFor="eksternSkoleAdresse">Skolens adresse</label>
            <input type="text" name="eksternSkoleAdresse" placeholder="Skolens besøksadresse" id="eksternSkoleAdresse" valueLink={this.linkState('eksternSkoleAdresse')} />
          </fieldset>
          <fieldset>
            <legend>Klassetrinn</legend>
            <select name="klassetrinn" valueLink={this.linkState('klassetrinn')}>
              <option value="">Velg klassetrinn</option>
              <option value="1. klasse">1. klasse</option>
              <option value="2. klasse">2. klasse</option>
              <option value="3. klasse">3. klasse</option>
              <option value="4. klasse">4. klasse</option>
            </select>
          </fieldset>
          <fieldset className={showTransportform(this.state.klassetrinn)}>
            <legend>Transportform</legend>
            <select name="transportform" valueLink={this.linkState('transportform')}>
              <option value="">Velg transportform</option>
              <option value="Buss" className={showTransportBuss(this.state.skole)}>Buss</option>
              <option value="Buss/ferge" className={showTransportFerge(this.state.skole)}>Buss/ferge</option>
              <option value="Buss/tog" className={showTransportTog(this.state.skole)}>Buss/tog</option>
              <option value="Transport ut av fylket" className={showEksternSkoleAdresse(this.state.skole)}>Transport ut av fylket</option>
            </select>
          </fieldset>
          <fieldset className={showTransportselskap(this.state.transportform)}>
            <legend>Transportør</legend>
            <select name="transporter" valueLink={this.linkState('transporter')}>
              <option value="">Velg transportør</option>
              <option value="Telemark Bilruter/Telemarksekspressen/Haukeliekspressen">Telemark Bilruter/Telemarksekspressen/Haukeliekspressen</option>
              <option value="Nettbuss/Drangedal Bilruter/Tinn Billag (inkl. Rjukanekspressen)">Nettbuss/Drangedal Bilruter/Tinn Billag (inkl. Rjukanekspressen)</option>
              <option value="Begge">Begge</option>
            </select>
          </fieldset>

          <fieldset className={showBusskortvalg(this.state.transporter)}>
            <legend>Busskort</legend>
            <select name="busskortstatus" valueLink={this.linkState('busskortstatus')}>
              <option value="">Velg busskort</option>
              <option value="Trenger nytt">Jeg har ikke hatt skyss tidligere og trenger busskort</option>
              <option value="Mistet busskort">Jeg har hatt skyss tidligere, men har mistet busskortet</option>
              <option value="Har busskort">Jeg har hatt skyss tidligere</option>
            </select>
          </fieldset>
          <fieldset className={showBusskortNummer(this.state.busskortstatus)}>
            <label htmlFor="busskortnummer">Busskortnummer</label>
            <input type="text" name="busskortnummer" placeholder="Busskortnummer" id="navn" valueLink={this.linkState('busskortnummer')} />
          </fieldset>
          <button className="btn">Send inn</button> <button className="btn" onClick={this.cancelForm}>Avbryt</button>
        </form>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app')
);