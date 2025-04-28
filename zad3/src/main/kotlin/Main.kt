import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import kotlinx.coroutines.runBlocking

val planZajec = mapOf(
    "poniedziałek" to listOf(
        "10:00 - 11:30 E-biznes",
        "14:00 - 16:00 Projektowanie aplikacji internetowych"
    ),
    "wtorek" to listOf(
        "10:30 - 12:00 Seminarium"
    ),
    "środa" to listOf(
        "Brak zajęć! 😎"
    ),
    "czwartek" to listOf(
        "8:00 - 12:00 Programowanie zespołowe",
        "16:30 - 18:00 Projektowanie obiektowe",
        "18:00 - 19:30 Pracownia języków skryptowych"
    ),
    "piątek" to listOf(
        "8:00 - 10:00 Projektowanie interfejsów",
        "14:00 - 16:00 Biometria"
    )
)

fun main() = runBlocking {
    val token = System.getenv("DISCORD_TOKEN") ?: error("Brak DISCORD_TOKEN w zmiennych środowiskowych.")

    val client = Kord(token)

    client.on<MessageCreateEvent> {
        val content = message.content.lowercase()

        if (message.author?.isBot == true) return@on

        when {
            content.startsWith("!plan") -> {
                val parts = content.split(" ")
                if (parts.size < 2) {
                    message.channel.createMessage("Użycie: `!plan <dzień tygodnia>`, np. `!plan poniedziałek`")
                } else {
                    val dzien = parts[1]
                    val plan = planZajec[dzien]
                    if (plan != null) {
                        val response = plan.joinToString(separator = "\n") { "- $it" }
                        message.channel.createMessage("📅 Plan na **$dzien**:\n$response")
                    } else {
                        message.channel.createMessage("Nie mam planu na **$dzien**.")
                    }
                }
            }
        }
    }

    client.login()
}
