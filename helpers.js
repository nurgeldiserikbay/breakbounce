export function anglesToCoordinates({ alpha, beta, gamma }) {
  const alphaRad = alpha * (Math.PI / 180)
  const betaRad = beta * (Math.PI / 180)
  const gammaRad = gamma * (Math.PI / 180)

  const x = Math.cos(betaRad) * Math.cos(gammaRad)
  const y = Math.cos(alphaRad) * Math.sin(gammaRad) + Math.sin(alphaRad) * Math.sin(betaRad) * Math.cos(gammaRad)
  const z = Math.sin(alphaRad) * Math.sin(gammaRad) - Math.cos(alphaRad) * Math.sin(betaRad) * Math.cos(gammaRad)

  return [x, y, z]
}
