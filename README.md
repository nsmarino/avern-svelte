Refactoring this repo to use as a starter for svelte/threejs projects

ECS is a way of organizing code and data that lets you build games that are larger, more complex and are easier to extend. Something is called an ECS when it:

    Has entities that uniquely identify objects in a game
    Has components which are datatypes that can be added to entities
    Has systems which are functions that run for all entities matching a component query

The big advantage of ECS is that new systems can be introduced at any stage of development, and will automatically get matched with any existing and new entities that have the right components. This promotes a design where systems are developed as single-responsibility, small units of functionality that can be easily deployed across different projects.

