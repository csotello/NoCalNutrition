import { useState } from "react"
import { ScrollView, View, Text } from "react-native"
import {Box} from "native-base"
import Habit from "../components/Habit"
const Habits = () => {
    const [habits,setHabits] = useState([{
        title:"Drink 100oz of Water",
        days:{
            Monday:"Default",
            Tuesday:"Default",
            Wednesday:"Default",
            Thursday:"Finished",
            Friday:"Default",
            Saturday:"Default",
            Sunday:"Default",
        }
    }])
    return(
        <View>
            <Box>
                <Text>Habits</Text>
                <ScrollView>
                    {habits.map((habit,i) => {
                        return <Habit title={habit.title} days={habit.days} key={i}></Habit>
                    })}
                </ScrollView>
            </Box>
        </View>
    )
}

export default Habits