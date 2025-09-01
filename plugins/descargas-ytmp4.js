import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre o enlace del video a descargar.`, m)
    }

    // Buscar el video
    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
    if (!ytplay2 || ytplay2.length == 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    let { title, url, views, ago, timestamp, author } = ytplay2
    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'

    const infoMessage = `「✦」Descargando *<${title || 'Desconocido'}>*\n\n> ✧ Canal » *${canal}*\n> ✰ Vistas » *${vistas}*\n> ⴵ Duración » *${timestamp || 'Desconocido'}*\n> ✐ Publicado » *${ago || 'Desconocido'}*\n> 🜸 Link » ${url}`
    await conn.reply(m.chat, infoMessage, m)

    // 🎬 Descargar MP4 con la API Nexfuture
    try {
      const api = await (await fetch(`https://api.nexfuture.com.br/api/downloads/youtube/playvideo/v2?query=${encodeURIComponent(url)}`)).json()
      const result = api?.resultado?.resultado?.video?.url
      const titulo = api?.resultado?.resultado?.video?.título || title || "Desconocido"

      if (!result) throw new Error('⚠ El enlace de video no se generó correctamente.')

      await conn.sendFile(
        m.chat,
        result,
        `${titulo}.mp4`,
        titulo,
        m
      )
    } catch (e) {
      return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Puede ser demasiado pesado o la URL no se generó.', m)
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`)
  }
}

handler.command = handler.help = ['ytmp4', 'ytv', 'play2', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}