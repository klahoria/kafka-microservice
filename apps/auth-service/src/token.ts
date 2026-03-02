export function generateTokens(app: any, user: any) {
  const accessToken = app.jwt.sign(
    { id: user.id, role: user.role },
    { expiresIn: "15m" }
  );

  const refreshToken = app.jwt.sign(
    { id: user.id },
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}