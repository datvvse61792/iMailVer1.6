<template>
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header class="masthead">
            <div class="inner">
                <h3 class="masthead-brand">
                    <div id="header-inner">
                        <a href="/">
                            <img alt="imail" height="50px; " id="Header1_headerimg" src="/logo.png" width="200px; ">
                        </a>
                    </div>
                </h3>
                <nav class="nav nav-masthead justify-content-center">
                    <nuxt-link to="/" class="nav-link active" v-if="!$auth.user">Trang chủ</nuxt-link>
                    <nuxt-link to="/policy" class="nav-link active" v-if="!$auth.user">Chính sách</nuxt-link>
                    <nuxt-link to="/encryptfile" class="nav-link active" v-if="!$auth.user">Mã hóa file</nuxt-link>
                    <nuxt-link to="/" class="nav-link" v-else>
                        <i class="mdi mdi-light mdi-email"></i>
                        <span class="has-icon-left">Hòm thư</span>
                    </nuxt-link>
                    <nuxt-link to="/key" class="nav-link" v-if="$auth.user">
                        <i class="mdi mdi-light mdi-key"></i>
                        <span class="has-icon-left">Quản lý khóa</span>
                    </nuxt-link>
                    <nuxt-link to="/logout" class="nav-link" v-if="$auth.user">
                        <i class="mdi mdi-light mdi-bell"></i>
                        <span class="has-icon-left">Thoát</span>
                    </nuxt-link>
                </nav>
            </div>
        </header>
        <nuxt/>
        <footer class="mastfoot mt-auto">
            <div class="foot">
                <p class="mt-5 mb-3 text-muted">2018 &copy; FPT University - 4S Team </p>
            </div>
        </footer>
    </div>
</template>

<style lang="scss">
    .has-icon-left {
        margin-left: 10px;
    }

</style>
