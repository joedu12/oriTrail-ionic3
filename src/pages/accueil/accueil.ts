import { Component, NgZone } from "@angular/core";

import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { ModalController, NavController, NavParams } from "ionic-angular";

import { modalConnexion } from "../connexion/modalConnexion";
import { modalEnregistrement } from "../enregistrement/modalEnregistrement";
import { scanManager } from "../scanManager/scanManager";

@Component({
  selector: "page-accueil",
  templateUrl: "accueil.html"
})
export class AccueilPage {
  // etat avec ou sans résultat
  public state: string = "before";
  // quand on passe en état resultat, on a un mode à spécifier
  public mode: string = "null";
  // définit l'état de connexion de l'utilisateur
  public connecter: string = "non";

  // information utilisateur
  public userInfo;

  // AFFICHAGE
  // contient le texte d'envoie des résultats ou d'une installation
  envoyer;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public zone: NgZone,
    public navparams: NavParams,
  ) {
    //set a key/value
    this.storage.set("api", "http://www.oritrail.fr/api/");

    this.zone.run(() => {
      // si on a des résultat à envoyer (paramètre de navigation de la vue depuis scanManager)
      if (navparams.get("resultat") != undefined) {
        // on affiche sur la page d'accueil qu'on peut envoyer des résultats
        this.state = "resultat"
        // on récupére le mode (installation ou résultats) pour afficher le bon message à l'utilisateur
        this.storage.get('mode').then((mode) => {
          if (mode == "I") { // mode installation
            this.envoyer = "Vous pouvez envoyer les résultats de l'installation de la course."
            // on affiche le bon bouton pour envoyer les résultats de l'install
            this.mode = "installation"
          } else { // mode cours / résultats
            this.envoyer = "Vous pouvez envoyer les résultats de la course."
            // on affiche le bon bouton pour envoyer les résultats d'une course
            this.mode = "course"
          }
        });

      }
    });

  }

  public async seconnecter() {
    let profileModal = this.modalCtrl.create(modalConnexion);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      // on met à jour la vue
      if (data == "ok") {
        this.zone.run(() => {
          this.storage.get('userInfo').then((val) => {
            //console.log(JSON.stringify(val))
            //this.userInfo = val;
          });
          this.connecter = "oui"
        })
      }
    });
  }

  public sinscrire() {
    let profileModal = this.modalCtrl.create(modalEnregistrement);
    profileModal.present();
  }

  public sedeconnecter() {
    this.connecter = "non"

  }

  public installerCourse() {
    console.log("lancement installation course");
    this.navCtrl.push(scanManager, { mode: "I" });
  }

  public participerCourse() {
    console.log("Lancement participation course");
    this.navCtrl.push(scanManager, { mode: "C" });
  }

  /**
   * Permet d'envoyer les résultats d'une course à l'api
   */
  public envoyerResultat() {

    this.zone.run(() => {
      this.storage.get('resultat').then((resultat) => {
        // TODO appel api
        // on supprime le bandeau si les résultats ont bien été envoyés
        this.enleverResultatAEnvoyer();
      });

    });
  }

  /**
   * Permet d'envoyer les résultats d'une installation à l'api
   */
  public envoyerInstallation() {

    this.zone.run(() => {
      this.storage.get('resultat').then((resultat) => {
        // TODO appel api
        // on supprime le bandeau si les résultats ont bien été envoyés
        this.enleverResultatAEnvoyer();
      });
    });

  }
  // Enleve sur la page les options pour envoyer les résultats 
  private enleverResultatAEnvoyer() {
    this.zone.run(() => {
      this.state = "before";
    });
  }
}
