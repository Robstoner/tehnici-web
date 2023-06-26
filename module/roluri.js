const Drepturi = require('./drepturi.js')

class Rol {
  static get tip() {
    return 'generic'
  }
  static get drepturi() {
    return []
  }
  constructor() {
    this.cod = this.constructor.tip
  }

  areDreptul(drept) {
    //drept trebuie sa fie tot Symbol
    console.log('in metoda rol!!!!')
    return this.constructor.drepturi.includes(drept) //verificam daca dreptul e in lista de drepturi ale rolului
  }
}

class RolAdmin extends Rol {
  static get tip() {
    return 'admin'
  }
  constructor() {
    super()
  }

  areDreptul() {
    return true //pentru ca e admin
  }
}

class RolAdministratorProduse extends Rol {
  static get tip() {
    return 'administratorProduse'
  }
  static get drepturi() {
    return [Drepturi.adaugareProduse, Drepturi.stergereProduse]
  }
  constructor() {
    super()
  }
}

class RolModerator extends Rol {
  static get tip() {
    return 'moderator'
  }
  static get drepturi() {
    return [
      Drepturi.vizualizareUtilizatori,
      Drepturi.stergereUtilizatori,
      Drepturi.vizualizareGalerie,
      Drepturi.trimitereCerereContact,
      Drepturi.vizualizareFacturi,
    ]
  }
  constructor() {
    super()
  }
}

class RolClient extends Rol {
  static get tip() {
    return 'comun'
  }
  static get drepturi() {
    return [Drepturi.cumparareProduse, Drepturi.vizualizareGalerie, Drepturi.trimitereCerereContact]
  }
  constructor() {
    super()
  }
}

class RolFactory {
  static creeazaRol(tip) {
    switch (tip) {
      case RolAdmin.tip:
        return new RolAdmin()
      case RolAdministratorProduse.tip:
        return new RolAdministratorProduse()
      case RolModerator.tip:
        return new RolModerator()
      case RolClient.tip:
        return new RolClient()
      default:
        throw new Error('Rolul nu exista')
    }
  }
}

module.exports = {
  RolFactory: RolFactory,
  // RolAdmin: RolAdmin,
}
