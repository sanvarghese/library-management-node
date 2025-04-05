import { DateTime } from "luxon"

/**
 * 
 * @param {Date} input 
 * @returns - time converted to UTC
 */

export const timeConverterForMongoose = (input)=> {
    if (!input) return null
    
    const date = DateTime.fromJSDate(new Date(input)) // Create a Luxon DateTime object

    return date.toUTC().toJSDate() // Convert to UTC and return as JavaScript Date object
}