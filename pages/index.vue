<template>
  <v-row dense>
    <v-col cols="12" md="8">
      <br><br><br><br>
      <v-row>
        <v-col>
          <h1 :class="{ 'display-2': true, 'font-weight-bold': true, 'mt-12': $vuetify.breakpoint.mdAndUp }">
            <v-row>La carta sin papel.</v-row>
            <v-row class="mt-3">Códigos QR</v-row>
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>Ya tengas un bar, un restaurante, una tienda de ropa, etc han cambiado los tiempos.</p>
          <p>Tus clientes quieren ver qué ofreces en sus teléfonos. Ulises te ofrece esta posibilidad sin coste.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <CtBtn type="empty" color="primary" class="pt-7 pb-7 px-12" to="/registro">
            Empezar
          </CtBtn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4" v-if="$vuetify.breakpoint.mdAndUp">
      <br><br><br><br>
      <v-img src="/img/ulises.png" :width="$vuetify.breakpoint.lgAndUp ? '80%' : '100%'" class="float-right" title="Ulises" alt="Ulises" />
    </v-col>
    <v-col cols="12">
      <br><br><br><br>
      <h1 class="display-1 text-center font-weight-black mt-12">
        Ulises es para las personas
      </h1>
    </v-col>
    <v-row>
      <v-col cols="12" class="text-center">
        <p>Ahora más que nunca se debe priorizar la salud de los clientes.</p>
        <p>Por razones de higiene en los establecimientos no puede haber cartas en papel. Es bueno mantener al mínimo los factores que puedan propagar los virus.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <CtCard elevation="5" type="empty" flat tile width="100%" class="white">
          <v-card-text class="secondary--text text-center">
            <v-row>
              <v-spacer />
              <v-col cols="3" sm="4">
                <v-img src="/img/icon_shop.png" width="64" title="PYMES y tiendas locales" alt="PYMES y tiendas locales" />
              </v-col>
              <v-spacer />
            </v-row>
            <span class="primary--text font-weight-bold body-1">
              PYMES<br>
              Tiendas locales
            </span>
          </v-card-text>
        </CtCard>
      </v-col>
      <v-col cols="12" sm="4">
        <CtCard elevation="5" type="empty" flat tile width="100%" class="white">
          <v-card-text class="secondary--text text-center">
            <v-row>
              <v-spacer />
              <v-col cols="3" sm="4">
                <v-img src="/img/icon_group.png" width="64" title="Comunidades Online" alt="Comunidades Online" />
              </v-col>
              <v-spacer />
            </v-row>
            <span class="primary--text font-weight-bold body-1">
              Comunidades<br>
              Online
            </span>
          </v-card-text>
        </CtCard>
      </v-col>
      <v-col cols="12" sm="4">
        <CtCard elevation="5" type="empty" flat tile width="100%" class="white">
          <v-card-text class="secondary--text text-center">
            <v-row>
              <v-spacer />
              <v-col cols="3" sm="4">
                <v-img src="/img/icon_hand.png" width="64" title="Organizaciones sin ánimo de lucro" alt="Organizaciones sin ánimo de lucro" />
              </v-col>
              <v-spacer />
            </v-row>
            <span class="primary--text font-weight-bold body-1">
              Organizaciones<br>
              sin ánimo de lucro
            </span>
          </v-card-text>
        </CtCard>
      </v-col>
    </v-row>
    <v-col cols="12">
      <br><br><br><br>
      <h1 class="display-1 text-center font-weight-black mt-12">
        Equipo
      </h1>
    </v-col>
    <v-row>
      <v-col cols="12" class="text-center">
        <p>Nos organizamos de forma horizontal.</p>
        <p>Un coordinador por departamento, objetivos semanales y nos ayudamos entre todos para que la rueda no se pare.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <CtCard elevation="5" type="empty" flat tile width="100%" class="white">
          <v-card-text class="secondary--text text-center">
            <v-row>
              <v-col cols="3">
                <v-img src="/img/icon_group.png" width="64" class="float-right" title="Antonio Gàmez Casado" alt="Antonio Gàmez Casado" />
              </v-col>
              <v-col cols="9">
                <span class="primary--text font-weight-bold body-1">Antonio Gàmez Casado</span><br>
                <span class="secondary--text">Coordinador de producto</span>
              </v-col>
            </v-row>
          </v-card-text>
        </CtCard>
      </v-col>
      <v-col cols="12" sm="6">
        <CtCard elevation="5" type="empty" flat tile width="100%" class="white">
          <v-card-text class="secondary--text text-center">
            <v-row>
              <v-col cols="3">
                <v-img src="/img/icon_group.png" width="64" class="float-right" title="Alejandro" alt="Alejandro" />
              </v-col>
              <v-col cols="9">
                <span class="primary--text font-weight-bold body-1">Alejandro</span><br>
                <span class="secondary--text">Diseñador</span>
              </v-col>
            </v-row>
          </v-card-text>
        </CtCard>
      </v-col>
      <v-col cols="12" sm="6">
        <CtCard elevation="5" type="empty" flat tile width="100%" class="white">
          <v-card-text class="secondary--text text-center">
            <v-row>
              <v-col cols="3">
                <v-img src="/img/icon_group.png" width="64" class="float-right" title="Ryu" alt="Ryu" />
              </v-col>
              <v-col cols="9">
                <span class="primary--text font-weight-bold body-1">Ryu</span><br>
                <span class="secondary--text">Coordinador de desarrollo</span>
              </v-col>
            </v-row>
          </v-card-text>
        </CtCard>
      </v-col>
      <v-col cols="12" sm="6">
        <CtCard elevation="5" type="empty" flat tile width="100%" class="white">
          <v-card-text class="secondary--text text-center">
            <v-row>
              <v-col cols="3">
                <v-img src="/img/icon_group.png" width="64" class="float-right" title="Laid" alt="Laid" />
              </v-col>
              <v-col cols="9">
                <span class="primary--text font-weight-bold body-1">Laid</span><br>
                <span class="secondary--text">Márqueting y comunicación</span>
              </v-col>
            </v-row>
          </v-card-text>
        </CtCard>
      </v-col>
    </v-row>
    <v-col cols="12">
      <br><br><br><br>
      <h1 class="display-1 text-center font-weight-black mt-12">
        Patrocinadores
      </h1>
    </v-col>
    <v-row>
      <v-col cols="12" class="text-center">
        <p>Empresas o personas que hacen posible el proyecto.</p>
      </v-col>
      <v-col cols="12">
        <CtCard elevation="5" type="empty" flat tile width="100%" class="white">
          <v-card-text class="secondary--text text-center">
            <v-row>
              <v-spacer />
              <v-col cols="4">
                <v-img src="/img/ciclotic_h_512.png" title="cicloTIC" alt="cicloTIC" />
              </v-col>
              <v-spacer />
            </v-row>
            <v-row class="mt-4">
              <v-col cols="3">
                <v-img src="/img/tu_empresa_h_512.png" class="example_partner" title="Tu empresa" alt="Tu empresa" />
              </v-col>
              <v-col cols="3">
                <v-img src="/img/una_persona.png" class="example_partner" title="Una persona" alt="Una persona" />
              </v-col>
              <v-col cols="3">
                <v-img src="/img/tu_restaurante.png" class="example_partner" title="Tu restaurante" alt="Tu restaurante" />
              </v-col>
              <v-col cols="3">
                <v-img src="/img/tu_restaurante.png" class="example_partner" title="Una persona" alt="Una persona" />
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="3">
                <v-img src="/img/tu_restaurante.png" class="example_partner" title="Una persona" alt="Una persona" />
              </v-col>
              <v-col cols="3">
                <v-img src="/img/tu_restaurante.png" class="example_partner" title="Tu restaurante" alt="Tu restaurante" />
              </v-col>
              <v-col cols="3">
                <v-img src="/img/tu_empresa_h_512.png" class="example_partner" title="Tu empresa" alt="Tu empresa" />
              </v-col>
              <v-col cols="3">
                <v-img src="/img/una_persona.png" class="example_partner" title="Una persona" alt="Una persona" />
              </v-col>
            </v-row>
          </v-card-text>
        </CtCard>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col>
        <br><br><br><br>
        <CtBtn block type="empty" color="primary" class="pt-7 pb-7 px-12" to="/registro">
          Empezar
        </CtBtn>
        <br><br>
      </v-col>
      <v-spacer />
    </v-row>
  </v-row>
</template>

<script>
export default {
  mounted() {
    // Try to get token cookie if token isn't set
    if (! this.$store.state.user.token || ! this.$store.state.user.user) {
      let token = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
      if (token) {
        this.$store.dispatch('user/setToken', token[2])

        let user = document.cookie.match(new RegExp('(^| )user=([^;]+)'))
        if (user) {
          this.$store.commit('user/updateUser', JSON.parse(user[2]))
        } else {
          console.log('test')
          try {
            this.$store.dispatch('user/fetchUser')
          } catch (error) { }
        }
      }
    }
  }
}
</script>
