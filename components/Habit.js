import { View, Text } from "react-native"
import {Box, Button, Flex} from 'native-base'
import { Icon } from "react-native-vector-icons/EvilIcons"
import { useState } from "react"
const Habit = (props) => {
    const [days,setDays] = useState(props.days)
    const handleClick = (day) => {
        let cur = days[day]
        days[day] = cur == "Default" ? "Complete" : "Default"
        setDays({
            ...days
        })
    }
    return(
        <View>
            <Box>
                <Text>{props.title}</Text>
                <Flex direction="row" w={"100%"}>
                {Object.keys(days).map((day,i) => {
                    return <Button w={"14%"} h={10} key={i} onPress={(evt) => handleClick(day)} background={days[day] == "Default" ? "#6fdc6f" : "#178237"}>{day}</Button>
                })}
                </Flex>
            </Box>
        </View>
    )
}

export default Habit