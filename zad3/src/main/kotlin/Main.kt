import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.*

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
    val token = System.getenv("DISCORD_TOKEN") ?: error("No DISCORD_TOKEN!")

    val kord = Kord(token)
    launch {
        embeddedServer(Netty, port = 8080) {
            routing {
                get("/") {
                    call.respondText("Bot działa! 🚀")
                }
                get("/plan/{dzien}") {
                    val dzien = call.parameters["dzien"]?.lowercase()
                    if (dzien != null) {
                        val plan = planZajec[dzien]
                        if (plan != null) {
                            val response = plan.joinToString("\n") { "- $it" }
                            call.respondText("📅 Plan na ${dzien.capitalize()}:\n$response")
                        } else {
                            call.respondText("Brak planu na ten dzień.", status = io.ktor.http.HttpStatusCode.NotFound)
                        }
                    } else {
                        call.respondText("Podaj dzień tygodnia w URL.")
                    }
                }
            }
        }.start(wait = false)
    }

    kord.on<MessageCreateEvent> {
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

    kord.login()
}
