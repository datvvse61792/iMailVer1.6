<template>
    <div></div>
</template>

<script>
    export default {
        name: 'logout',

        async created() {
            await this.$auth.logout()
            if (process.browser) {
                localStorage.removeItem('email')
                localStorage.removeItem('privateKey')
                localStorage.removeItem('publicKey')
            }
        }
    }
</script>

<style scoped>

</style>
