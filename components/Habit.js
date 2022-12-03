import { ScrollView, Text } from "react-native"
import {Box, Button, Flex, IconButton, Spacer} from 'native-base'
import Icon  from "react-native-vector-icons/EvilIcons"
import { useState } from "react"
const Habit = (props) => {
    const [days,setDays] = useState(props.habit.days)
    const dayText = {Monday:"M",Tuesday:"T",Wednesday:"W",Thursday:"Th",Friday:"F",Saturday:"S",Sunday:"Su"}
    const handleClick = (day) => {
        let cur = days[day]
        days[day] = cur == "Default" ? "Complete" : "Default"
        setDays({
            ...days
        })
    }
    const reset = () =>{
        props.setDays(props.habit.title)
        setDays({
            Monday:"Default",
            Tuesday:"Default",
            Wednesday:"Default",
            Thursday:"Default",
            Friday:"Default",
            Saturday:"Default",
            Sunday:"Default",
        })
    }
    return(
        <ScrollView>
            <Box rounded={"lg"}>
            <Flex direction="row" w={"100%"}>
                <Text style={{paddingLeft:20,fontSize:20}}>{props.habit.title}</Text>
                <Text style={{marginLeft:40,fontSize:20}}>{props.habit.catagory}</Text>
                <Spacer/>
                <IconButton
                    icon={<Icon name="trash" size={30}/>}
                    onPress={() => props.remove(props.habit.title)}
                    />
                <IconButton
                    icon={<Icon name="undo" size={30}/>}
                    onPress={() => reset()}
                    />
                </Flex>
                <Flex direction="row" w={"100%"}>
                {Object.keys(days).map((day,i) => {
                    return <Button rounded 
                        borderRadius={100} 
                        variant="outline" 
                        borderColor={"amber.100"} 
                        marginBottom={10}
                        marginRight={2}
                        w={"12%"} h={10} key={i} 
                        onPress={(evt) => handleClick(day)} 
                        background={days[day] == "Default" ? "#6fdc6f" : "#178237"}>{dayText[day]}</Button>
                })}
                </Flex>
            </Box>
        </ScrollView>
    )
}

export default Habit