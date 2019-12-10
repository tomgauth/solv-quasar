import { Dialog } from 'quasar'

export function showErrorMessage(errorMessage) {
    Dialog.create( {
        title: 'error',
        message: errorMessage
    } )
}