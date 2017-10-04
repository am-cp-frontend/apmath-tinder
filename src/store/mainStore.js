import React from 'react'

import {observable} from 'mobx'

import AsyncDataStore from './AsyncDataStore'

class MainStore {
    @observable user = {
        auth: false,
        type: 'student'
    }
    @observable mounted = {}
    constructor() {
        this.nextMountId = 0
    }

    mount(subStore) {
        this.nextMountId++
        this.mounted[this.nextMountId] = subStore
        return this.nextMountId
    }

    unmount(id) {
        delete this.mounted[id]
    }
}

const store = new MainStore()

export default store