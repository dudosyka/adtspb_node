<template>
    <article class="association-card card shadow" v-for="(card, id) in associations" v-bind:key="associations[id].id">
        <h2 class="association-card_heading">{{ card.name }}</h2>
        <p class="association-card_old gray-text">от {{ card.min_age + ' до ' + card.max_age}} лет</p>
        <p class="gray-text">{{ card.description }}</p>
        <article class="association-card_time">
            <section class="association-card_time_item">
                <p class="black-text">{{ card.lessons_week + correctLessons(card.lessons_week)}} {{ card.hours_week + correctHours(card.hours_week) }}</p>
                <p class="gray-text">в неделю</p>
            </section>
            <section class="association-card_time_item">
                <p class="black-text">{{ card.study_years + correctYears(card.study_years) }}</p>
                <p class="gray-text">обучения</p>
            </section>
        </article>

        <button class="association-card_timetable-toggle">Рассписание</button>
        <article class="association-card_timetable">
            <div class="bread-crumbs">
                <button class="bread-crumb"
                        :class="{'bread-crumb--active': group.active}"
                        v-for="group of card.groups"
                        @click="group.timetable.show = true;"
                >{{ group.name }}</button>
            </div>
            <section>
                <table class="schedule" v-for="(group, id) of card.groups">
                    <tr v-for="day in group.timetable.week">
                        <td>{{ day.name }}</td><td>{{ day.time }}</td>
                    </tr>
                </table>
                <hr class="black-line">
            </section>
        </article>

        <!--
        <div class="association-test warning-container" v-if="card.test.is">
            <h3 class="assoc-test-heading" v-text="card.test.name"></h3>
            <p class="assoc-test-description" v-text="card.test.description"></p>
        </div>
        !-->

        <div v-if="!card.isRecruiment" class="association-reserve fatal-container">
            <p class="assoc-reserve-description">Идёт набор в резерв</p>
        </div>
        <div v-else class="association-reserve accept-container">
            <p class="assoc-reserve-description">Идёт набор</p>
        </div>

        <div class="association-card_buttons buttons">
            <button v-if="!proposalParms.associations[id]" class="dark-box dark-button" @click="addAssociation(id)">Записать</button>
            <button v-else-if='!proposalParms.associations[id].already' class="dark-box dark-button" @click="removeAssociation(id)">Отмена</button>
        </div>
    </article>
</template>

<script>
export default {
    name: "AssociationCard",
    props: [],
    methods: {

    }
}
</script>

<style scoped>

</style>
