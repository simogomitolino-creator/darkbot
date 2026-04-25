const {
  SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,
  ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits
} = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('🎫 Open a ticket manually'),

  async execute(interaction) {
    const guild = interaction.guild;
    const user = interaction.user;
    const ticketCat = process.env.TICKET_CATEGORY_ID;

    const existing = guild.channels.cache.find(
      c => c.name === `ticket-${user.username}` && c.parentId === (ticketCat || null)
    );

    if (existing) {
      await interaction.reply({ content: `❌You already have an open ticket: ${existing}`, ephemeral: true });
      return;
    }

    const ch = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: ChannelType.GuildText,
      parent: ticketCat || null,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ],
    });

    const embed = new EmbedBuilder()
      .setTitle('🎫 Open ticket')
      .setDescription('Hi! Describe your request and our staff will get back to you soon.')
      .setColor(0xE63946)
      .setFooter({ text: "iDayss's Services • Support" })
      .setTimestamp();

    const closeBtn = new ButtonBuilder()
      .setCustomId(`close_ticket_${ch.id}`)
      .setLabel('🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger);

    await ch.send({
      content: `${user} <@&${process.env.STAFF_ROLE_ID}>`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(closeBtn)],
    });

    await interaction.reply({ content: `✅ Open Ticket: ${ch}`, ephemeral: true });
  },
};
