# Manual WebRTC

Based on
- https://www.youtube.com/watch?v=h2WkZ0h0-Rc (Part 1)
- https://www.youtube.com/watch?v=UMy6vV4tW00 (Part 2)

# Sequence

1. A: offers and produces `sdp1`
2. B: set `sdp1` as remote desc
3. B: answers and produces `sdp2`
4. A: set `sdp2` as remote desc
5. A: Add B as ice candidate OR B: Add A as ice candidate
