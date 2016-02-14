export default class User {
  constructor (obj) {
    this.obj = obj
  }

  get id () {
    return this.obj.id
  }

  get name () {
    return this.obj.name.fullName
  }

  get email () {
    return this.obj.primaryEmail
  }

  get workPhone () {
    if (!this.obj.phones) {
      return ''
    }

    return this.obj.phones.find((p) => { return p.type === 'work' }).value
  }
}
