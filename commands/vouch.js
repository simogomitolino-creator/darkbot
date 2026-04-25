const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('⭐ Leave a voucher for a purchase')
    .addUserOption(opt =>
      opt.setName('staff').setDescription('The staff you dealt with').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('buyed').setDescription('What did you buy?').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('comment').setDescription('Your experience').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('stars').setDescription('Assessment (1-5)').setRequired(true).setMinValue(1).setMaxValue(5)
    ),

  async execute(interaction) {
    const staff = interaction.options.getUser('staff');
    const buyed = interaction.options.getString('Buyed');
    const comment = interaction.options.getString('comment');
    const stars = interaction.options.getInteger('stars');

    const stars = '⭐'.repeat(stelle) + '☆'.repeat(5 - stelle);

    const embed = new EmbedBuilder()
      .setTitle(`${stars} Vouch`)
      .setColor(0xFFD700)
      .addFields(
        { name: '👤 Buyer', value: `${interaction.user}`, inline: true },
        { name: '👮 Staff', value: `${staff}`, inline: true },
        { name: '📦 Buyed', value: acquisto },
        { name: '💬 Comment', value: commento },
        { name: '⭐ Assessment', value: `${stars} (${stelle}/5)` },
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: "iDayss's Services • Vouches" })
      .setTimestamp();

    const vouchChannel = interaction.guild.channels.cache.get(process.env.VOUCHES_CHANNEL_ID);
    if (!vouchChannel) {
      await interaction.reply({ content: '❌ Vouchers channel not found!', ephemeral: true });
      return;
    }

    await vouchChannel.send({ embeds: [embed] });
    await interaction.reply({ content: `✅ Voucher sent in ${vouchChannel}! Thanks for your review!`, ephemeral: true });
  },
};
