exports.getTopics = (req, res) => {
    try {
        const topics = {
            1: {
                id: 1,
                name: 'Politics',
                info: 'Keep up with the latest news'
            },
            2: {
                id: 2,
                name: 'Arts',
                info: 'Music, Litterature, Cinema...'
            },
            3: {
                id: 3,
                name: 'Sports',
                info: 'Will there ever be another Bergkamp?'
            },
            4: {
                id: 4,
                name: 'Health',
                info: 'What is going on inside you?'
            },
            5: {
                id: 5,
                name: 'Crafts',
                info: 'If you make things with your hands'
            },
            6: {
                id: 6,
                name: 'Home',
                info: 'Tips and tricks to improve your home'
            },
            7: {
                id: 7,
                name: 'Travel',
                info: 'Where next?'
            }
        };
        res.status(200).send(Object.values(topics));

    } catch (error) {
        res.status(500).send(error);
    }

};