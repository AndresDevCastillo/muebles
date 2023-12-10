<template>
  <div class="inventario">
    <v-card class="ma-3">
      <v-row justify="space-between" justify-sm="start" class="px-6 my-4">
        <v-col md="3" lg="2" sm="12" cols="auto">
          <div class="d-flex align-center"><v-icon size="x-large" icon="mdi-store-edit"></v-icon>
            <h1 class="px-3">Inventario</h1>
          </div>
        </v-col>
        <v-col sm="5" md="7" lg="8" cols="auto" class="text-sm-start text-md-end">
          <v-btn prepend-icon="mdi-store-plus" color="yellow" @click="dialogoI = true">Crear
            Stock</v-btn>
        </v-col>
        <v-col sm="4" md="2" lg="2" cols="auto">
          <v-btn color="blue" prepend-icon="mdi mdi-truck-plus" @click="dialogoB = true">Bodega</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-card class="ma-3 w-100">
          <v-card-title>
            <v-col md="6" sm="12"><v-text-field v-model="searchInventario" append-inner-icon="mdi-magnify" label="Buscar"
                variant="outlined" hide-details></v-text-field></v-col>
          </v-card-title>
          <v-data-table :headers="headers" :items="inventario" :sort-by="[{ key: 'nombre', order: 'asc' }]"
            class="elevation-1" :search="searchInventario">
            <template v-slot:item.producto.valor_compra="{ item }">
              {{ item.producto.valor_compra.toLocaleString() }}
            </template>
            <template v-slot:item.producto.valor_contado="{ item }">
              {{ item.producto.valor_contado.toLocaleString() }}
            </template>
            <template v-slot:item.producto.valor_credito="{ item }">
              {{ item.producto.valor_credito.toLocaleString() }}
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <v-icon size="small" class="me-2" @click="editarStockVista(Object.assign({}, item))">
                mdi-pencil
              </v-icon>
              <v-icon size="small" @click="eliminarProducto(item._id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-row>
    </v-card>
    <v-dialog v-model="dialogoI" width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formInventario">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Existencia" type="number" min="1" required variant="outlined"
                    v-model="formInventario.cantidad" :rules="existenciaRule" :counter="65"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select :items="productos" no-data-text="Sin productos" item-title="nombre" item-value="_id"
                    variant="outlined" label="Productos" required v-model="formInventario.producto"
                    :rules="[v => !!v || 'Seleccione un Producto']"></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select :items="bodegas" variant="outlined" label="Bodega" required v-model="formInventario.bodega"
                    item-title="nombre" item-value="_id" :rules="[v => !!v || 'Seleccione una bodega']"
                    no-data-text="No hay bodegas disponibles"></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogoI = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearInventario">
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoE" width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formInventarioEditar">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Existencia" min="1" type="number" required variant="outlined"
                    v-model="formInventarioEditar.existencias" :rules="existenciaRule" :counter="65"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="tonal" @click="dialogoE = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="actualizarInventario">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoB" width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formBodega">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nombre" required variant="outlined" v-model="formBodega.nombre"
                    :rules="nombreRules" :counter="65"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select :items="departamento" variant="outlined" label="Departamento" required
                    v-model="formBodega.departamento" item-title="departamento" item-value="departamento"
                    :rules="[v => !!v || 'Seleccione un departamento']" no-data-text="No hay departamentos"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select :items="ciudades" variant="outlined" label="Ciudad" required v-model="formBodega.ciudad"
                    :rules="[v => !!v || 'Seleccione una ciudad']" no-data-text="Escoja un departamento"></v-select>
                </v-col>
                <v-col>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearBodega()">
                      Crear
                    </v-btn>
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogoB = false">
                      Cerrar
                    </v-btn>
                  </v-card-actions>
                </v-col>
                <v-data-table :headers="headersBodega" :items="bodegas" :sort-by="[{ key: 'nombre', order: 'asc' }]"
                  class="elevation-1">
                  <template v-slot:item.actions="{ item }">
                    <v-icon size="small" @click="eliminarBodega(item._id)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Session from '@/validation/session';
export default {
  name: 'inventarioVista',
  data: () => ({
    token: null,
    api: import.meta.env.VITE_APP_API_URL,
    inventario: [],
    productos: [],
    departamento: [],
    ciudades: [],
    bodegas: [],
    searchInventario: null,
    headers: [
      { title: 'Nombre', key: 'producto.nombre' },
      { title: 'Cantidad Inicial', key: 'cantidad' },
      { title: 'Existencia', key: 'existencias' },
      { title: 'Valor compra', key: 'producto.valor_compra' },
      { title: 'Valor contado', key: 'producto.valor_contado' },
      { title: 'Valor crédito', key: 'producto.valor_credito' },
      { title: 'Bodega', key: 'bodega.nombre' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    headersBodega: [
      { title: 'Nombre', key: 'nombre' },
      { title: 'Ciudad', key: 'ciudad' },
      { title: 'Departamento', key: 'departamento' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    dialogoI: false,
    dialogoE: false,
    dialogoB: false,
    disableBtn: false,
    formInventario: {
      producto: null,
      bodega: null,
      cantidad: 1,
    },
    formInventarioEditar: {
      id: null,
      cantidad: 0,
      existencias: 1,
    },
    formBodega: {
      nombre: null,
      ciudad: null,
      departamento: null
    },
    existenciaRule: [
      (v) => (!!v) || "Añada al menos un producto",
      (v) =>
        (/^[0-9]+$/.test(v)) || "El numero no debe contener caracteres",
      (v) => (parseInt(v) > 0) || "El numero debe ser mayor o igual a 0",
    ],
    nombreRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
    ],
  }),
  methods: {
    async listarInventario() {
      await axios.get(`${this.api}/inventario`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        this.inventario = resp.data;
      }).catch(async error => {
        console.log(error)
        switch (error.response.status) {
          case 401:
            await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
            this.$store.commit('setusuario', { usuario: null, hora_login: null });
            this.$router.push('/');
            break;

          default:
            Swal.fire({ icon: 'error', title: 'No se pudo obtener los productos en stock', showConfirmButton: false, timer: 1500 });
            break;
        }
      });
    },
    async listarProductos() {
      await axios.get(`${this.api}/producto`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(resp => {
        this.productos = resp.data;
      }).catch(async error => {
        console.log(error);
        switch (error.response.status) {
          case 401:
            await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
            this.$store.commit('setusuario', { usuario: null, hora_login: null });
            this.$router.push('/');
            break;

          default:
            Swal.fire({ icon: 'error', title: 'No se pudo obtener los productos del inventario', showConfirmButton: false, timer: 1500 });
            break;
        }
      });
    },
    async eliminarProducto(id) {
      await Swal.fire({
        icon: 'info',
        title: 'Seguro quiere eliminar el producto del inventario?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axios.delete(`${this.api}/inventario/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1500, showConfirmButton: false });
          })
        }
      }).catch(() => {
        return Swal.fire({ icon: 'error', title: 'No se pudo eliminar el producto del inventario', showConfirmButton: false, timer: 1500 });
      });
      await this.listarInventario();
      await this.listarProductos();
    },
    async crearInventario() {
      const { valid } = await this.$refs.formInventario.validate();
      if (valid) {
        this.disableBtn = true;
        this.formInventario.cantidad = parseInt(this.formInventario.cantidad);
        this.dialogoI = false;
        await axios.post(`${this.api}/inventario/crear`, this.formInventario, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then((resp) => {
          if (resp.status == 201) {
            return Swal.fire({
              icon: 'success',
              title: 'Exitoso',
              text: 'Stock creado correctamente!',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }).catch(async error => {
          console.log(error);
          switch (error.response.status) {
            case 401:
              await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
              this.$store.commit('setusuario', { usuario: null, hora_login: null });
              this.$router.push('/');
              break;

            default:
              Swal.fire({ icon: 'error', title: 'No se pudo crear el stock', showConfirmButton: false, timer: 1500 });
              break;
          }
        });
      }
      this.disableBtn = false;
      this.formInventario = {
        producto: null,
        cantidad: 1,
        bodega: null
      };
      await this.listarInventario();
      await this.listarProductos();
    },
    editarStockVista(item) {
      this.formInventarioEditar.id = item._id;
      this.formInventarioEditar.cantidad = parseInt(item.cantidad);
      this.formInventarioEditar.existencias = parseInt(item.existencias);
      this.dialogoE = true;

    },
    async actualizarInventario() {
      this.disableBtn = true;
      const { valid } = await this.$refs.formInventarioEditar.validate();
      if (valid) {
        this.dialogoE = false;
        this.formInventarioEditar.existencias = parseInt(this.formInventarioEditar.existencias);
        this.formInventarioEditar.cantidad = this.formInventarioEditar.existencias;
        axios.put(`${this.api}/inventario/actualizar`, this.formInventarioEditar, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(async () => {
          await this.listarInventario();
          await this.listarProductos();
          return Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Inventario actualizado correctamente!',
            showConfirmButton: false,
            timer: 1500
          });
        }).catch(async error => {
          console.log(error);
          switch (error.response.status) {
            case 401:
              await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
              this.$store.commit('setusuario', { usuario: null, hora_login: null });
              this.$router.push('/');
              break;

            default:
              Swal.fire({ icon: 'error', title: 'No se pudo crear el stock', showConfirmButton: false, timer: 1500 });
              break;
          }
        });
      }
      this.disableBtn = false;
      await this.listarInventario();
      await this.listarProductos();
    },
    async obtenerUbicacion() {
      await axios.get(`${this.api}/pueblo/ubicacion`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        this.departamento = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener los departamentos',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async obtenerBodegas() {
      await axios.get(`${this.api}/bodega`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        this.bodegas = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener las bodegas',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async crearBodega() {
      const { valid } = await this.$refs.formBodega.validate();
      if (valid) {
        this.disableBtn = true;
        this.dialogoB = false;
        await axios.post(`${this.api}/bodega/crear`, this.formBodega, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then((resp) => {
          if (resp.status == 201) {
            return Swal.fire({
              icon: 'success',
              title: 'Exitoso',
              text: 'Bodega creado correctamente!',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }).catch(async error => {
          console.log(error);
          switch (error.response.status) {
            case 401:
              await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
              this.$store.commit('setusuario', { usuario: null, hora_login: null });
              this.$router.push('/');
              break;

            default:
              Swal.fire({ icon: 'error', title: 'No se pudo crear la bodega', showConfirmButton: false, timer: 1500 });
              break;
          }
        });
      }
      this.disableBtn = false;
      this.formBodega = {
        nombre: null,
        ciudad: null,
        departamento: null
      };
      await this.obtenerBodegas();
    },
    async eliminarBodega(id) {
      await Swal.fire({
        icon: 'info',
        title: 'Seguro quiere eliminar la bodega?',
        text: 'La bodega no debe tener inventario',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${this.api}/bodega/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1500, showConfirmButton: false });
          })
        }
      }).catch(() => {
        return Swal.fire({ icon: 'error', title: 'No se pudo eliminar la bodega', showConfirmButton: false, timer: 1500 });
      });
      await this.obtenerBodegas();
    },
    debugSession() {
      Session.expiredSession();
    }
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      this.$emit('loadingSweet');
      await this.listarInventario();
      await this.listarProductos();
      await this.obtenerUbicacion();
      await this.obtenerBodegas();
      this.$emit('closeSweet');
    }
  },
  watch: {
    "formBodega.departamento": {
      handler(departamentoNombre) {
        this.formBodega.ciudad = null;
        this.departamento.map(departamento => {
          if (departamento.departamento == departamentoNombre) {
            this.ciudades = departamento.ciudades;
          }
        })
      },
    },
  }

}
</script>

<style></style>
