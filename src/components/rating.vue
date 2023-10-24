<template>
    <div class="rating">
        <ul class="list">
            <li @click="rate(star)" v-for="star in maxStars" :class="{ 'active': star <= stars }" :key="star.stars"
                class="star">
                <i :class="star <= stars ? 'fas fa-star' : 'far fa-star'"></i>
            </li>
        </ul>
        <div v-if="hasCounter" class="info counter">
            <span class="score-rating">{{ stars }}</span>
            <span class="divider">/</span>
            <span class="score-max">{{ maxStars }}</span>
        </div>
        <v-col cols="12">
            <v-textarea class="pt-3" v-if="stars > 0" v-model="comentario" label="Comentario"
                :placeholder="'Ingrese comentario'" auto-grow variant="outlined" rows="2" row-height="10" shaped>{{ com }}
            </v-textarea>
        </v-col>
        <v-btn color="yellow" @click="calificar()" v-if="stars > 0">
            Calificar
        </v-btn>
    </div>
</template>
<script>

export default {
    name: 'RatingComponent',
    props: ['grade', 'maxStars', 'hasCounter'],
    data() {
        return {
            stars: this.grade,
            comentario: ''
        }
    },
    methods: {
        rate(star) {
            if (typeof star === 'number' && star <= this.maxStars && star >= 0) {
                this.stars = this.stars === star ? star - 1 : star
            }
        },
        calificar() {
            let calificacion = {
                calificacion: this.stars,
                sugerencia: this.comentario
            }
            this.$emit('calificarEmit', calificacion);
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
    color: #b7b7b7;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 33px rgba(19, 18, 18, 0.09);
}

.rating .list {
    padding: 0;
    margin: 0 20px 0 0;
}

.rating .list:hover .star {
    color: #ffe100;
}

.rating .list .star {
    display: inline-block;
    font-size: 42px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
}

.rating .list .star:hover~.star:not(.active) {
    color: inherit;
}

.rating .list .star:first-child {
    margin-left: 0;
}

.rating .list .star.active {
    color: #ffe100;
}

.rating .info {
    margin-top: 15px;
    font-size: 40px;
    text-align: center;
    display: table;
}

.rating .info .divider {
    margin: 0 5px;
    font-size: 30px;
}

.rating .info .score-max {
    font-size: 30px;
    vertical-align: sub;
}
</style>