<template>
    <b-container class="white-box" v-if="$auth.user">
        <div v-if="publicKey && privateKey" class="lead">
            <div class="mb-3" v-if="userInfo">
                <h3 class="text-center">Thông tin về khóa của bạn</h3>
                <p>Tên: <strong>{{userInfo.name}}</strong></p>
                <p>Email: <strong>{{userInfo.email}}</strong></p>
                <p>Key ID: <strong>{{keyInfo.keyid.toHex().toUpperCase()}}</strong></p>
                <p>Key Fingerprint: <strong>{{keyInfo.getFingerprint().toUpperCase()}}</strong></p>
            </div>
            <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu">
                <b-button-group class="mx-1">
                    <b-btn :block="true" :size="'lg'" :variant="'primary'" v-b-modal.modalPrevent>Tạo key mới</b-btn>
                </b-button-group>
                <b-button-group class="mx-1">
                    <b-btn @click="exportKey()">Export</b-btn>
                </b-button-group>
            </b-button-toolbar>
        </div>
        <div v-else>
            <b-btn :block="true" :size="'lg'" :variant="'primary'" v-b-modal.modalPrevent>Tạo Key</b-btn>
            <b-form-file class="mt-3" plain @change="loadTextFromFile"></b-form-file>
        </div>
        <b-modal id="modalPrevent" ref="modal" title="Nhập mật khẩu" @ok="handleOk" @shown="clearName">
            <form @submit.stop.prevent="handleSubmit">
                <b-form-input type="text" placeholder="Nhập mật khẩu cho khóa của bạn"
                              v-model="passphrase"></b-form-input>
            </form>
        </b-modal>
    </b-container>
    <b-container v-else>
        <h1>Vui lòng <a href="/" class="alert">Đăng nhập</a>để tiếp tục</h1>
    </b-container>
</template>

<script>
    const openpgp = require('openpgp')

    export default {
        name: 'key',

        data() {
            return {
                publicKey: null,
                privateKey: null,
                file: [],
                userInfo: null,
                keyInfo: null,
                passphrase: null
            }
        },

        methods: {

            /**
             * Generate OpenPGP Key-pair for user
             * Public key will be uploaded to public key server after generated
             */
            async generateKey() {
                let options = {
                    userIds: [{name: this.$auth.user.name, email: this.$auth.user.email}],
                    curve: 'ed25519',
                    passphrase: this.passphrase
                }
                await openpgp.generateKey(options).then(key => {
                    this.privateKey = key.privateKeyArmored
                    this.publicKey = key.publicKeyArmored
                    localStorage.removeItem('email')
                    localStorage.removeItem('privateKey')
                    localStorage.removeItem('publicKey')
                    localStorage.setItem('email', this.$auth.user.email)
                    localStorage.setItem('privateKey', this.privateKey)
                    localStorage.setItem('publicKey', this.publicKey)
                    let publicKeyInfo = openpgp.key.readArmored(this.publicKey).keys
                    let keyId = publicKeyInfo[0].primaryKey.keyid.toHex().toUpperCase()
                    let fingerprint = publicKeyInfo[0].primaryKey.getFingerprint().toUpperCase()
                    // Sending public key information to public key server
                    this.$axios.post('/api/key', {
                        email: this.$auth.user.email,
                        key_id: keyId,
                        key: this.publicKey,
                        fingerprint: fingerprint
                    }).then(res => {
                        console.log(res)
                    })
                    this.$toasted.show('Tạo key mới thành công!', {
                        theme: 'bubble',
                        position: 'top-center',
                        duration: 1000
                    })
                })
                this.getKeyInfo()
            },

            /**
             * Export key-pair as 'key.asc' file for storage purpose.
             */
            exportKey() {
                let FileSaver = require('file-saver')
                let text = this.publicKey + '\n' + this.privateKey
                let blob = new Blob([text], {type: 'text/plain;charset=utf-8'})
                FileSaver.saveAs(blob, 'key.asc')
            },

            /**
             * Load information from key-pair file and import it into localStorage
             */
            loadTextFromFile(event) {
                const fileList = event.target.files
                let file = fileList[0]
                let extension = (file.name.match(/[^\\/]\.([^\\/.]+)$/) || [null]).pop()
                if (extension === 'asc') {
                    this.$toasted.show('Nhập thông tin thành công!', {
                        theme: 'bubble',
                        position: 'top-center',
                        duration: 2000
                    })
                    const reader = new FileReader()
                    reader.onload = e => {
                        let result = e.target.result
                        let regex = /-----BEGIN PGP PRIVATE KEY BLOCK-----/i
                        let index = regex.exec(result).index - 1
                        this.publicKey = result.substring(0, index)
                        this.privateKey = result.substring(index + 1, result.length - 1)
                        localStorage.setItem('email', this.$auth.user.email)
                        localStorage.setItem('privateKey', this.privateKey)
                        localStorage.setItem('publicKey', this.publicKey)
                        this.getKeyInfo()
                    }
                    reader.readAsText(file)
                } else {
                    event.target.value = ''
                    this.$toasted.show('Upload Key thất bại. Vui lòng upload lại đúng định dạng Key', {
                        theme: 'primary',
                        position: 'top-center',
                        duration: 2500
                    })
                }
            },

            /**
             * Set the information of user and key from localStorage key-pair
             */
            getKeyInfo() {
                if (this.privateKey) {
                    let keyring = new openpgp.Keyring()
                    let importResult = keyring.privateKeys.importKey(this.privateKey)
                    if (importResult === null) {
                        keyring.store()
                    }
                    let keys = keyring.privateKeys.keys
                    let pubKey = openpgp.key.readArmored(this.publicKey).keys
                    this.userInfo = keys[0].users[0].userId
                    this.keyInfo = pubKey[0].primaryKey
                }
            },

            clearName() {
                this.name = ''
            },

            handleOk(evt) {
                // Prevent modal from closing
                evt.preventDefault()
                if (!this.passphrase) {
                    alert('Bạn cần nhập mật khẩu khóa để tiếp tục!')
                } else if (!this.passphrase.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,30})/)) {
                    this.$toasted.show('Mật khẩu từ 8 - 30 ký tự, có cả chữ Hoa, thường và ký tự đặc biệt!', {
                        theme: 'primary',
                        position: 'top-center',
                        duration: 1500
                    })
                } else {
                    this.handleSubmit()
                }
            },

            handleSubmit() {
                this.generateKey()
                this.$refs.modal.hide()
            }
        },

        created() {
            if (process.browser && this.$auth.user) {
                let email = localStorage.getItem('email')
                let privateKey = localStorage.getItem('privateKey')
                let publicKey = localStorage.getItem('publicKey')
                if (this.$auth.user.email === email) {
                    this.publicKey = publicKey
                    this.privateKey = privateKey
                }
            }
        },

        mounted() {
            this.getKeyInfo()
        }
    }
</script>

<style scoped>

    .alert {
        text-decoration: underline;
        text-align: right;
    }
</style>
