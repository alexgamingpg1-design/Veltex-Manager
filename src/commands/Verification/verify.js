import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { errorEmbed, infoEmbed, successEmbed } from '../../utils/embeds.js';
import { withErrorHandling } from '../../utils/errorHandler.js';
import { verifyUser } from '../../services/verificationService.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verifiziere dich um Zugriff auf den server zu Bekommen !'),

    async execute(interaction, config, client) {
        const wrappedExecute = withErrorHandling(async () => {
            const guild = interaction.guild;

            const result = await verifyUser(client, guild.id, interaction.user.id, {
                source: 'command_self',
                moderatorId: null
            });

            if (!result.success) {
                if (result.alreadyVerified) {
                    return await InteractionHelper.safeReply(interaction, {
                        embeds: [infoEmbed("Already Verified", "Du bist schon Verifiziert ! ")],
                        flags: MessageFlags.Ephemeral
                    });
                }

                return await InteractionHelper.safeReply(interaction, {
                    embeds: [errorEmbed(
                        "Verifizierung fehlgeschlagen",
                        "Ein fehler ist aufgetreten bitte kontaktiere das Server Team !"
                    )],
                    flags: MessageFlags.Ephemeral
                });
            }

            await InteractionHelper.safeReply(interaction, {
                embeds: [successEmbed(
                    "Verifizierung erfolgreich",
                    `Erfolgreich Verifiziert du hast nun die role  **${result.roleName}**  Willkommen auf NRW Roleplay  🎉`
                )],
                flags: MessageFlags.Ephemeral
            });
        }, { command: 'verify' });

        return await wrappedExecute(interaction, config, client);
    }
};
